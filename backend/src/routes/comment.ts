import { Hono } from "hono";
import { authMiddleware } from "../utils/authMiddleware";
import { catchErrorHandler } from "../utils/catchErrorHandler";
import { errorHandler } from "../utils/error";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { blogRouter } from "./blog";

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
      include: { likes: true },
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json(comments, {
      status: 200,
    });
  } catch (error) {
    return catchErrorHandler(c, error);
  }
});

commentRouter.put("/likeComment/:commentId", authMiddleware, async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
      log: ["error", "info", "query", "warn"],
    }).$extends(withAccelerate());

    const commentId = c.req.param("commentId");
    const userId = c.get("userId");

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { likes: true },
    });

    if (!comment) {
      throw errorHandler({ statusCode: 404, message: "Comment Not Found" });
    }

    const isLiked = comment.likes.some((user) => user.id === userId);

    if (isLiked) {
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          likes: { disconnect: { id: userId } },
          numberOfLikes: { decrement: 1 },
        },
      });
    } else {
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          likes: { connect: { id: userId } },
          numberOfLikes: { increment: 1 },
        },
      });
    }

    const updatedComment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { likes: true },
    });

    return c.json(updatedComment, {
      status: 200,
    });
  } catch (error) {
    return catchErrorHandler(c, error);
  }
});

commentRouter.put("/editComment/:commentId", authMiddleware, async (c) => {
  try {
    const commentId = c.req.param("commentId");
    const { content } = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
      log: ["error", "info", "query", "warn"],
    }).$extends(withAccelerate());

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw errorHandler({ statusCode: 404, message: "Comment Not Found" });
    }

    if (comment.authorId !== c.get("userId")) {
      throw errorHandler({
        statusCode: 403,
        message: "You are not allowed to edit this comment",
      });
    }

    const editedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content,
      },
    });

    return c.json(editedComment, { status: 200 });
  } catch (error) {
    return catchErrorHandler(c, error);
  }
});

commentRouter.delete("/deleteComment/:commentId", authMiddleware, async (c) => {
  const commentId = c.req.param("commentId");

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
      log: ["error", "info", "query", "warn"],
    }).$extends(withAccelerate());

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw errorHandler({ statusCode: 404, message: "Comment Not Found" });
    }

    if (comment.authorId !== c.get("userId")) {
      throw errorHandler({
        statusCode: 403,
        message: "You are not allowed to edit this comment",
      });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return c.json("Comment has been deleted successfully!", { status: 200 });
  } catch (error) {
    return catchErrorHandler(c, error);
  }
});
