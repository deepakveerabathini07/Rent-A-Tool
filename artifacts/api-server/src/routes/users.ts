import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateUserBody, GetUserParams } from "@workspace/api-zod";

const router: IRouter = Router();

function formatUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl ?? undefined,
    location: user.location ?? undefined,
    bio: user.bio ?? undefined,
    rating: parseFloat(user.rating),
    reviewCount: user.reviewCount,
    createdAt: user.createdAt.toISOString(),
  };
}

router.get("/users", async (_req, res) => {
  const users = await db.select().from(usersTable);
  res.json(users.map(formatUser));
});

router.get("/users/:id", async (req, res) => {
  const { id } = GetUserParams.parse({ id: parseInt(req.params.id) });
  const users = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);

  if (!users.length) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(formatUser(users[0]));
});

router.post("/users", async (req, res) => {
  const body = CreateUserBody.parse(req.body);
  const [user] = await db
    .insert(usersTable)
    .values({
      name: body.name,
      email: body.email,
      role: body.role,
      location: body.location,
      bio: body.bio,
    })
    .returning();

  res.status(201).json(formatUser(user));
});

export default router;
