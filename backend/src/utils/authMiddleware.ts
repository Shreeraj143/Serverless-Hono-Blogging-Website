import { verify } from "hono/jwt";
import { errorHandler } from "./error";
import { catchErrorHandler } from "./catchErrorHandler";

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
    return catchErrorHandler(c, error);
  }
};
