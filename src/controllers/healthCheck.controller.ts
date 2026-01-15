import { Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthenticatedRequest } from "../types/index.js";

const healthcheck = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, null, "Everything is Working Fine"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Health check failed - Something went wrong")
      );
  }
});

export { healthcheck };
