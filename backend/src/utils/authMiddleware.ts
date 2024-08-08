import { verify } from "hono/jwt";
import { errorHandler } from "./error";

// Reusable middleware function
export const authMiddleware = async (c: any, next: any) => {
  const token = c.req.header("authorization") || localStorage.getItem("token");
  if (!token) {
    throw errorHandler({ statusCode: 401, message: "Unauthorized" });
  }
  try {
    const user = await verify(token, c.env.JWT_SECRET);
    if (user) {
      c.set("userId", user.id as string);
      await next();
    } else {
      throw errorHandler({ statusCode: 403, message: "You are not logged in" });
    }
  } catch (error: any) {
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
  }
};
