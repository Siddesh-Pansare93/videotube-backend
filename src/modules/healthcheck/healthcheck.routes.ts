import { Router, RequestHandler } from "express";
import { healthcheck } from "./healthcheck.controller.js";

const router = Router();

router.route("/").get(healthcheck as unknown as RequestHandler);

export default router;
