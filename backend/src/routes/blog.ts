import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@shreeraj1811/medium-common";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { errorHandler } from "../utils/error";
import { catchErrorHandler } from "../utils/catchErrorHandler";

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
  } catch (error: any) {
    return catchErrorHandler(c, error);
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

  const slug = body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  console.log(slug);

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      category: body.category,
      image: body.image,
      slug,
      authorId: authorId,
    },
  });
  return c.json({ post });
});

blogRouter.get("/bulk", async (c) => {
  try {
    const {
      authorId,
      slug,
      postId,
      category,
      startIndex,
      limit,
      order,
      searchTerm,
    } = c.req.query();
    const startingIndex = parseInt(startIndex) || 0;
    const limitedPosts = parseInt(limit) || 9;
    const sortDirection = order === "asc" ? "asc" : "desc";

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
      log: ["query", "info", "warn", "error"],
    }).$extends(withAccelerate());

    const posts = await prisma.post.findMany({
      where: {
        ...(authorId && { authorId: authorId }),
        ...(category && { category: category }),
        ...(slug && { slug: slug }),
        ...(postId && { id: postId }),
        ...(searchTerm && {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { content: { contains: searchTerm, mode: "insensitive" } },
          ],
        }),
      },
      select: {
        id: true,
        title: true,
        category: true,
        slug: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        author: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        updatedAt: sortDirection,
      },
      skip: startingIndex,
      take: limitedPosts,
    });

    const totalPosts = await prisma.post.count();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthPosts = await prisma.post.count({
      where: {
        createdAt: { gte: oneMonthAgo },
      },
    });

    return c.json({ posts, totalPosts, lastMonthPosts }, { status: 200 });
  } catch (error) {
    return catchErrorHandler(c, error);
  }
});

blogRouter.delete("/deletepost/:postId/:userId", async (c) => {
  if (c.req.param("userId") !== c.get("authorId")) {
    throw errorHandler({
      statusCode: 403,
      message: "You are not allowed to delete this post",
    });
  }

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
      log: ["query", "error", "info", "warn"],
    }).$extends(withAccelerate());

    await prisma.post.delete({
      where: { id: c.req.param("postId") },
    });
    return c.json("The post has been deleted", {
      status: 200,
    });
  } catch (error) {
    return catchErrorHandler(c, error);
  }
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

blogRouter.put("/updatepost/:postId/:userId", async (c) => {
  if (c.req.param("userId") != c.get("authorId")) {
    throw errorHandler({
      statusCode: 403,
      message: "You are not allowed to update this post",
    });
  }

  const { title, content, category, image } = await c.req.json();

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
      log: ["query", "error", "info", "warn"],
    }).$extends(withAccelerate());

    const updatedPost = await prisma.post.update({
      where: { id: c.req.param("postId") },
      data: {
        title,
        content,
        category,
        image,
      },
      select: {
        id: true,
        title: true,
        category: true,
        slug: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    return c.json(updatedPost, {
      status: 200,
    });
  } catch (error) {
    return catchErrorHandler(c, error);
  }
});
