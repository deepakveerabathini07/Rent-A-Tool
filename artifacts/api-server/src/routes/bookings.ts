import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable, toolsTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListBookingsQueryParams,
  CreateBookingBody,
  GetBookingParams,
  UpdateBookingStatusParams,
  UpdateBookingStatusBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function formatBooking(booking: typeof bookingsTable.$inferSelect) {
  const tool = await db.select().from(toolsTable).where(eq(toolsTable.id, booking.toolId)).limit(1);
  const user = await db.select().from(usersTable).where(eq(usersTable.id, booking.userId)).limit(1);
  const owner = tool[0] ? await db.select().from(usersTable).where(eq(usersTable.id, tool[0].ownerId)).limit(1) : [];

  return {
    id: booking.id,
    toolId: booking.toolId,
    toolName: tool[0]?.name ?? "Unknown Tool",
    toolImageUrl: tool[0]?.imageUrl ?? "",
    userId: booking.userId,
    userName: user[0]?.name ?? "Unknown User",
    ownerId: tool[0]?.ownerId ?? 0,
    ownerName: owner[0]?.name ?? "Unknown Owner",
    startDate: booking.startDate,
    endDate: booking.endDate,
    totalDays: booking.totalDays,
    totalPrice: parseFloat(booking.totalPrice),
    status: booking.status,
    message: booking.message ?? undefined,
    createdAt: booking.createdAt.toISOString(),
  };
}

router.get("/bookings", async (req, res) => {
  const query = ListBookingsQueryParams.parse(req.query);
  const conditions = [];

  if (query.status) conditions.push(eq(bookingsTable.status, query.status as "pending" | "approved" | "rejected" | "completed"));
  if (query.userId) conditions.push(eq(bookingsTable.userId, query.userId));

  const bookings = await db
    .select()
    .from(bookingsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  let result = await Promise.all(bookings.map(formatBooking));

  if (query.ownerId) {
    result = result.filter((b) => b.ownerId === query.ownerId);
  }

  res.json(result);
});

router.get("/bookings/:id", async (req, res) => {
  const { id } = GetBookingParams.parse({ id: parseInt(req.params.id) });
  const bookings = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id)).limit(1);

  if (!bookings.length) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  res.json(await formatBooking(bookings[0]));
});

router.post("/bookings", async (req, res) => {
  const body = CreateBookingBody.parse(req.body);

  const tool = await db.select().from(toolsTable).where(eq(toolsTable.id, body.toolId)).limit(1);
  if (!tool.length) {
    res.status(404).json({ error: "Tool not found" });
    return;
  }

  const startDate = new Date(body.startDate);
  const endDate = new Date(body.endDate);
  const totalDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const totalPrice = parseFloat(tool[0].pricePerDay) * totalDays;

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      toolId: body.toolId,
      userId: body.userId,
      startDate: body.startDate,
      endDate: body.endDate,
      totalDays,
      totalPrice: totalPrice.toString(),
      message: body.message,
      status: "pending",
    })
    .returning();

  res.status(201).json(await formatBooking(booking));
});

router.put("/bookings/:id", async (req, res) => {
  const { id } = UpdateBookingStatusParams.parse({ id: parseInt(req.params.id) });
  const body = UpdateBookingStatusBody.parse(req.body);

  const [booking] = await db
    .update(bookingsTable)
    .set({ status: body.status })
    .where(eq(bookingsTable.id, id))
    .returning();

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  res.json(await formatBooking(booking));
});

export default router;
