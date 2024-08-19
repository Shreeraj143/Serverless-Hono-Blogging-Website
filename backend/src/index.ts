import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";
import { cors } from "hono/cors";
import { commentRouter } from "./routes/comment";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use("/*", cors());

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/comment", commentRouter);

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
