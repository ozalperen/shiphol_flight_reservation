import express from "express";
import { createEstateHandler } from "../controllers/estate.controller";

import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import { createEstateSchema } from "../schemas/estate.schema";

const router = express.Router();

router.use(deserializeUser, requireUser);
router
  .route("/")
  .post(validate(createEstateSchema), createEstateHandler);

export default router;
