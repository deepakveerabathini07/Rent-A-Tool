import {
  MOCK_TOOLS,
  MOCK_CATEGORIES,
  MOCK_STATS,
  MOCK_BOOKINGS,
  MOCK_OWNER_STATS,
} from "./mock-data";

// Intercept fetch so all /api/* calls return mock data instead of hitting a real server
const originalFetch = window.fetch.bind(window);

window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : (input as Request).url;

  if (!url.startsWith("/api/")) {
    return originalFetch(input, init);
  }

  // Simulate a small network delay
  await new Promise((r) => setTimeout(r, 150));

  const method = (init?.method || "GET").toUpperCase();

  // GET /api/tools/featured
  if (url === "/api/tools/featured") {
    return jsonResponse(MOCK_TOOLS.filter((t) => t.available).slice(0, 4));
  }

  // GET /api/tools/categories
  if (url === "/api/tools/categories") {
    return jsonResponse(MOCK_CATEGORIES);
  }

  // GET /api/tools/:id
  const toolDetailMatch = url.match(/^\/api\/tools\/(\d+)$/);
  if (toolDetailMatch && method === "GET") {
    const tool = MOCK_TOOLS.find((t) => t.id === Number(toolDetailMatch[1]));
    if (tool) return jsonResponse(tool);
    return jsonResponse({ message: "Not found" }, 404);
  }

  // GET /api/tools (with optional query params)
  if (url.startsWith("/api/tools") && method === "GET") {
    const params = new URLSearchParams(url.includes("?") ? url.split("?")[1] : "");
    let tools = [...MOCK_TOOLS];
    const category = params.get("category");
    const search = params.get("search");
    if (category) tools = tools.filter((t) => t.category === category);
    if (search) {
      const q = search.toLowerCase();
      tools = tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    return jsonResponse(tools);
  }

  // POST /api/tools
  if (url === "/api/tools" && method === "POST") {
    const body = JSON.parse((init?.body as string) || "{}");
    const newTool = { ...body, id: Date.now(), rating: 0, reviewCount: 0, createdAt: new Date().toISOString() };
    MOCK_TOOLS.push(newTool);
    return jsonResponse(newTool, 201);
  }

  // GET /api/stats/platform
  if (url === "/api/stats/platform") {
    return jsonResponse(MOCK_STATS);
  }

  // GET /api/stats/owner/:id
  if (url.startsWith("/api/stats/owner")) {
    return jsonResponse(MOCK_OWNER_STATS);
  }

  // GET /api/bookings
  if (url.startsWith("/api/bookings") && method === "GET") {
    const params = new URLSearchParams(url.includes("?") ? url.split("?")[1] : "");
    let bookings = [...MOCK_BOOKINGS];
    const userId = params.get("userId");
    const ownerId = params.get("ownerId");
    if (userId) bookings = bookings.filter((b) => b.userId === Number(userId));
    if (ownerId) bookings = bookings.filter((b) => b.ownerId === Number(ownerId));
    return jsonResponse(bookings);
  }

  // POST /api/bookings
  if (url === "/api/bookings" && method === "POST") {
    const body = JSON.parse((init?.body as string) || "{}");
    const tool = MOCK_TOOLS.find((t) => t.id === body.toolId);
    const newBooking = {
      id: Date.now(),
      toolId: body.toolId,
      toolName: tool?.name || "Unknown Tool",
      toolImageUrl: tool?.imageUrl || "",
      userId: body.userId,
      userName: "You",
      ownerId: tool?.ownerId || 0,
      ownerName: tool?.ownerName || "Owner",
      startDate: body.startDate,
      endDate: body.endDate,
      totalDays: Math.ceil((new Date(body.endDate).getTime() - new Date(body.startDate).getTime()) / 86400000),
      totalPrice: (tool?.pricePerDay || 0) * Math.ceil((new Date(body.endDate).getTime() - new Date(body.startDate).getTime()) / 86400000),
      status: "pending" as const,
      message: body.message,
      createdAt: new Date().toISOString(),
    };
    MOCK_BOOKINGS.push(newBooking);
    return jsonResponse(newBooking, 201);
  }

  // PATCH /api/bookings/:id  (status update)
  const bookingStatusMatch = url.match(/^\/api\/bookings\/(\d+)$/);
  if (bookingStatusMatch && method === "PATCH") {
    const body = JSON.parse((init?.body as string) || "{}");
    const booking = MOCK_BOOKINGS.find((b) => b.id === Number(bookingStatusMatch[1]));
    if (booking) {
      booking.status = body.status;
      return jsonResponse(booking);
    }
    return jsonResponse({ message: "Not found" }, 404);
  }

  // Fallback — return empty 200
  return jsonResponse({});
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
