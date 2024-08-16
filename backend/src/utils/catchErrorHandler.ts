import { Context } from "hono";

export const catchErrorHandler = (c: Context, error: any) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const name = error.name || "Internal Server Error";
  return c.json(
    {
      success: false,
      name,
      statusCode,
      message,
    },
    {
      status: statusCode,
    }
  );
};
