import { ApiError } from "../../utils/ApiError.js";

export const healthcheckService = async () => {
    return {
        status: "OK",
        message: "Health check passed"
    };
};
