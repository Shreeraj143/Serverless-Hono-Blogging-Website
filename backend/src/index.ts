import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use("/*", cors());

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

app.use("*", async (c, next) => {
  try {
    await next();
  } catch (error: any) {
    console.log(error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    return c.json(
      {
        success: false,
        statusCode,
        message,
      },
      {
        status: statusCode,
      }
    );
  }
});

export default app;
