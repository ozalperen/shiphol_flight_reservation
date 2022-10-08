import express from "express";
import {
  getFlightHandler,
  getFlightbyIdHandler,
} from "../controllers/flight.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import { getFlightSchema, getFlightbyIdSchema } from "../schemas/flight.schema";

const router = express.Router();

router.use(deserializeUser, requireUser);
router.route("/").post(validate(getFlightSchema), getFlightHandler);
router
  .route("/:scipholid")
  .get(validate(getFlightbyIdSchema), getFlightbyIdHandler);

export default router;
