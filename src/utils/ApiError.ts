class ApiError extends Error {
  statuscode: number;
  data: null;
  success: boolean;
  errors: string[];

  constructor(
    statuscode: number,
    message: string = "Something went wrong",
    errors: string[] = [],
    stack: string = ""
  ) {
    super(message);
    this.statuscode = statuscode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
