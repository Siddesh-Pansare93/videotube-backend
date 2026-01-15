import { Router, RequestHandler } from "express";
import { healthcheck } from "../controllers/healthCheck.controller.js";

const router = Router();

router.route("/").get(healthcheck as unknown as RequestHandler);

export default router;
