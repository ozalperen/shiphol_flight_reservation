import express from "express";
import { getFlightHandler } from "../controllers/flight.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import { getFlightSchema } from "../schemas/flight.schema";

const router = express.Router();

router.use(deserializeUser, requireUser);
router.route("/").post(getFlightHandler, validate(getFlightSchema));


export default router;
