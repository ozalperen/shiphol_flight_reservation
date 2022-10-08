import express from "express";
import {
  createBookingHandler,
  getBookingsHandler,
  deleteBookingHandler,
} from "../controllers/booking.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import {
  createBookingSchema,
  getBookingSchema,
  deleteBookingSchema,
} from "../schemas/booking.schema";
import { bookingLimiter } from "../middleware/limiter";

const router = express.Router();

router.use(deserializeUser, requireUser);
router
  .route("/")
  .get(bookingLimiter, getBookingsHandler)
  .post(bookingLimiter, validate(createBookingSchema), createBookingHandler);

router
  .route("/:bookingId")
  .delete(bookingLimiter, validate(deleteBookingSchema), deleteBookingHandler);

export default router;
