import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@shreeraj1811/medium-common";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { errorHandler } from "../utils/error";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    authorId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  try {
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if (user && typeof user.id === "string") {
      c.set("authorId", user.id as string); // Cast user.id to string
      await next();
    } else {
      throw errorHandler({ statusCode: 403, message: "You are not logged in" });
    }
  } catch (e) {
    throw errorHandler({ statusCode: 403, message: "You are not logged in" });
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  // console.log(title, content);

  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Invalid inputs",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    log: ["query", "info", "warn", "error"],
  }).$extends(withAccelerate());

  const authorId = c.get("authorId");
  console.log(authorId);

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: authorId,
    },
  });
  return c.json({ id: post.id });
});

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  // console.log(body);

  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Invalid inputs",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    log: ["query", "info", "warn", "error"],
  }).$extends(withAccelerate());

  const post = await prisma.post.update({
    where: { id: body.id },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.json({ id: post.id });
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    log: ["query", "info", "warn", "error"],
  }).$extends(withAccelerate());

  const posts = await prisma.post.findMany({
    select: {
      title: true,
      content: true,
      id: true,
      author: {
        select: {
          username: true,
        },
      },
    },
  });
  return c.json({ posts });
});

blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    log: ["query", "info", "warn", "error"],
  }).$extends(withAccelerate());

  const id = c.req.param("id");

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    return c.json({ post });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Error while fetching blog post",
    });
  }
});
