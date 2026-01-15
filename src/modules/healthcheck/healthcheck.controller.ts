import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AuthenticatedRequest } from "../../types/index.js";
import { healthcheckService } from "./healthcheck.service.js";

const healthcheck = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await healthcheckService();
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          "Health check passed"
        )
      );
});

export { healthcheck };
