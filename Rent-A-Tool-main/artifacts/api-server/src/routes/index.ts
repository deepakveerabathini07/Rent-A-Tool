import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toolsRouter from "./tools";
import usersRouter from "./users";
import bookingsRouter from "./bookings";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(toolsRouter);
router.use(usersRouter);
router.use(bookingsRouter);
router.use(statsRouter);

export default router;
