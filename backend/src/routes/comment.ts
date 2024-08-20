import { Hono } from "hono";
import { authMiddleware } from "../utils/authMiddleware";
import { catchErrorHandler } from "../utils/catchErrorHandler";
import { errorHandler } from "../utils/error";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const commentRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

commentRouter.post("/create", authMiddleware, async (c) => {
  try {
    const { content, postId, authorId } = await c.req.json();
    if (authorId !== c.get("userId")) {
      throw errorHandler({
        statusCode: 403,
        message: "You are not allowed to create this comment",
      });
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
      log: ["query", "error", "info", "warn"],
    }).$extends(withAccelerate());

    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
      },
    });

    return c.json(newComment);
  } catch (error) {
    return catchErrorHandler(c, error);
  }
});

commentRouter.get("/getPostComments/:postId", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
      log: ["query", "error", "info", "warn"],
    }).$extends(withAccelerate());

    const comments = await prisma.comment.findMany({
      where: { postId: c.req.param("postId") },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return c.json(comments, {
      status: 200,
    });
  } catch (error) {
    return catchErrorHandler(c, error);
  }
});
