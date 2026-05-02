import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable, toolsTable, usersTable } from "@workspace/db";
import { eq, count, sum, desc } from "drizzle-orm";
import { GetOwnerStatsParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats/platform", async (_req, res) => {
  const [toolCount] = await db.select({ count: count() }).from(toolsTable);
  const [userCount] = await db.select({ count: count() }).from(usersTable);
  const [bookingCount] = await db.select({ count: count() }).from(bookingsTable);
  const activeBookings = await db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "approved"));
  const categories = await db.selectDistinct({ category: toolsTable.category }).from(toolsTable);
  const earnings = await db.select({ total: sum(bookingsTable.totalPrice) }).from(bookingsTable).where(eq(bookingsTable.status, "completed"));

  res.json({
    totalTools: toolCount.count,
    totalUsers: userCount.count,
    totalBookings: bookingCount.count,
    activeRentals: activeBookings[0]?.count ?? 0,
    totalEarnings: parseFloat(earnings[0]?.total ?? "0"),
    categoriesCount: categories.length,
  });
});

router.get("/stats/owner/:ownerId", async (req, res) => {
  const { ownerId } = GetOwnerStatsParams.parse({ ownerId: parseInt(req.params.ownerId) });

  const tools = await db.select().from(toolsTable).where(eq(toolsTable.ownerId, ownerId));
  const toolIds = tools.map((t) => t.id);

  let activeRentals = 0;
  let pendingRequests = 0;
  let totalEarnings = 0;
  let monthlyEarnings = 0;
  const topTool = tools.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))[0]?.name;

  for (const toolId of toolIds) {
    const bookings = await db.select().from(bookingsTable).where(eq(bookingsTable.toolId, toolId));
    for (const b of bookings) {
      if (b.status === "approved") activeRentals++;
      if (b.status === "pending") pendingRequests++;
      if (b.status === "completed") {
        totalEarnings += parseFloat(b.totalPrice);
        const createdAt = new Date(b.createdAt);
        const now = new Date();
        if (createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()) {
          monthlyEarnings += parseFloat(b.totalPrice);
        }
      }
    }
  }

  const avgRating = tools.length
    ? tools.reduce((sum, t) => sum + parseFloat(t.rating), 0) / tools.length
    : 0;

  res.json({
    totalTools: tools.length,
    activeRentals,
    pendingRequests,
    totalEarnings,
    monthlyEarnings,
    topTool,
    averageRating: parseFloat(avgRating.toFixed(2)),
  });
});

export default router;
