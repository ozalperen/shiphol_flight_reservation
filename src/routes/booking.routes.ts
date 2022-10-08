import express from "express";
import { createBookingHandler } from "../controllers/booking.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import { createBookingSchema } from "../schemas/booking.schema";

const router = express.Router();

router.use(deserializeUser, requireUser);
router
  .route('/')
  .post(
    
    validate(createBookingSchema),
    createBookingHandler);


export default router;