import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { toolsTable, usersTable } from "@workspace/db";
import { eq, ilike, gte, lte, and, desc } from "drizzle-orm";
import {
  ListToolsQueryParams,
  CreateToolBody,
  GetToolParams,
  UpdateToolParams,
  UpdateToolBody,
  DeleteToolParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function formatTool(tool: typeof toolsTable.$inferSelect, owner: typeof usersTable.$inferSelect | undefined) {
  return {
    id: tool.id,
    ownerId: tool.ownerId,
    ownerName: owner?.name ?? "Unknown",
    name: tool.name,
    description: tool.description,
    category: tool.category,
    imageUrl: tool.imageUrl,
    pricePerDay: parseFloat(tool.pricePerDay),
    pricePerHour: tool.pricePerHour ? parseFloat(tool.pricePerHour) : undefined,
    available: tool.available,
    rating: parseFloat(tool.rating),
    reviewCount: tool.reviewCount,
    location: tool.location,
    createdAt: tool.createdAt.toISOString(),
  };
}

router.get("/tools", async (req, res) => {
  const query = ListToolsQueryParams.parse(req.query);

  const conditions = [];
  if (query.category) conditions.push(eq(toolsTable.category, query.category));
  if (query.search) conditions.push(ilike(toolsTable.name, `%${query.search}%`));
  if (query.available !== undefined) conditions.push(eq(toolsTable.available, query.available));

  const tools = await db
    .select()
    .from(toolsTable)
    .leftJoin(usersTable, eq(toolsTable.ownerId, usersTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(toolsTable.rating));

  const result = tools.map((row) => formatTool(row.tools, row.users ?? undefined));

  let filtered = result;
  if (query.minPrice !== undefined) filtered = filtered.filter((t) => t.pricePerDay >= query.minPrice!);
  if (query.maxPrice !== undefined) filtered = filtered.filter((t) => t.pricePerDay <= query.maxPrice!);

  res.json(filtered);
});

router.get("/tools/categories", async (_req, res) => {
  const tools = await db.select({ category: toolsTable.category }).from(toolsTable);

  const counts: Record<string, number> = {};
  for (const t of tools) {
    counts[t.category] = (counts[t.category] ?? 0) + 1;
  }

  const iconMap: Record<string, string> = {
    "Power Tools": "zap",
    "Hand Tools": "wrench",
    "Garden Tools": "leaf",
    "Electrical": "plug",
    "Plumbing": "droplets",
    "Construction": "hard-hat",
    "Automotive": "car",
    "Cleaning": "sparkles",
    "Ladders": "layout",
    "Measuring": "ruler",
  };

  const categories = Object.entries(counts).map(([category, count]) => ({
    category,
    count,
    icon: iconMap[category] ?? "tool",
  }));

  res.json(categories);
});

router.get("/tools/featured", async (_req, res) => {
  const tools = await db
    .select()
    .from(toolsTable)
    .leftJoin(usersTable, eq(toolsTable.ownerId, usersTable.id))
    .where(eq(toolsTable.available, true))
    .orderBy(desc(toolsTable.rating))
    .limit(8);

  res.json(tools.map((row) => formatTool(row.tools, row.users ?? undefined)));
});

router.get("/tools/:id", async (req, res) => {
  const { id } = GetToolParams.parse({ id: parseInt(req.params.id) });
  const rows = await db
    .select()
    .from(toolsTable)
    .leftJoin(usersTable, eq(toolsTable.ownerId, usersTable.id))
    .where(eq(toolsTable.id, id));

  if (!rows.length) {
    res.status(404).json({ error: "Tool not found" });
    return;
  }

  res.json(formatTool(rows[0].tools, rows[0].users ?? undefined));
});

router.post("/tools", async (req, res) => {
  const body = CreateToolBody.parse(req.body);
  const [tool] = await db
    .insert(toolsTable)
    .values({
      ownerId: body.ownerId,
      name: body.name,
      description: body.description,
      category: body.category,
      imageUrl: body.imageUrl,
      pricePerDay: body.pricePerDay.toString(),
      pricePerHour: body.pricePerHour?.toString(),
      available: body.available,
      location: body.location,
    })
    .returning();

  const owner = await db.select().from(usersTable).where(eq(usersTable.id, tool.ownerId)).limit(1);
  res.status(201).json(formatTool(tool, owner[0]));
});

router.put("/tools/:id", async (req, res) => {
  const { id } = UpdateToolParams.parse({ id: parseInt(req.params.id) });
  const body = UpdateToolBody.parse(req.body);

  const [tool] = await db
    .update(toolsTable)
    .set({
      name: body.name,
      description: body.description,
      category: body.category,
      imageUrl: body.imageUrl,
      pricePerDay: body.pricePerDay.toString(),
      pricePerHour: body.pricePerHour?.toString(),
      available: body.available,
      location: body.location,
    })
    .where(eq(toolsTable.id, id))
    .returning();

  if (!tool) {
    res.status(404).json({ error: "Tool not found" });
    return;
  }

  const owner = await db.select().from(usersTable).where(eq(usersTable.id, tool.ownerId)).limit(1);
  res.json(formatTool(tool, owner[0]));
});

router.delete("/tools/:id", async (req, res) => {
  const { id } = DeleteToolParams.parse({ id: parseInt(req.params.id) });
  await db.delete(toolsTable).where(eq(toolsTable.id, id));
  res.status(204).send();
});

export default router;
