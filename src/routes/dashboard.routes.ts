import { Router, RequestHandler } from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT as unknown as RequestHandler);

router.route("/stats").get(getChannelStats as unknown as RequestHandler);
router.route("/videos").get(getChannelVideos as unknown as RequestHandler);

export default router;
