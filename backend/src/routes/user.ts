import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import {
  signinInput,
  signupInput,
  updateUser,
} from "@shreeraj1811/medium-common";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error";
import { authMiddleware } from "../utils/authMiddleware";
import { catchErrorHandler } from "../utils/catchErrorHandler";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"], // Enable detailed logging
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    const { success } = signupInput.safeParse(body);
    if (!success) {
      throw errorHandler({ statusCode: 411, message: "Invalid Inputs" });
    }

    const hashedPassword = bcryptjs.hashSync(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        username: body.username,
      },
    });
    console.log(user);

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      jwt: token,
      // id: user.id,
    });
  } catch (error: any) {
    return catchErrorHandler(c, error);
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    const { success } = signinInput.safeParse(body);
    if (!success) {
      throw errorHandler({ statusCode: 411, message: "Invalid Inputs" });
    }

    const findUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!findUser) {
      throw errorHandler({ statusCode: 401, message: "User not found" });
    }

    const validPassword = bcryptjs.compareSync(
      body.password,
      findUser?.password
    );

    if (!validPassword) {
      throw errorHandler({
        statusCode: 401,
        message: "Incorrect Email or Password",
      });
    }

    const jwt = await sign({ id: findUser.id }, c.env.JWT_SECRET);

    const { password, ...rest } = findUser;

    return c.json({ jwt, user: rest });
  } catch (error: any) {
    return catchErrorHandler(c, error);
  }
});

userRouter.post("/oauth", async (c) => {
  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (user) {
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      const { password, ...rest } = user;
      return c.json({ jwt, user: rest });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const user = await prisma.user.create({
        data: {
          username:
            body.username.toLowerCase().split(" ").join("") +
            Math.random().toString(9).slice(-4),
          email: body.email,
          password: hashedPassword,
          profilePicture: body.googlePhotoUrl,
        },
      });

      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      const { password, ...rest } = user;

      return c.json({ jwt, user: rest });
    }
  } catch (error: any) {
    return catchErrorHandler(c, error);
  }
});

userRouter.put("/update/:usrId", authMiddleware, async (c) => {
  const { usrId } = c.req.param();
  const userId = c.get("userId");
  const body = await c.req.json();

  try {
    if (userId !== usrId) {
      throw errorHandler({
        statusCode: 403,
        message: "You are not allowed to update this user",
      });
    }

    if (body.username?.includes(" ")) {
      throw errorHandler({
        statusCode: 400,
        message: "Username cannot contain spaces",
      });
    }

    const { success } = updateUser.safeParse(body);
    if (!success) {
      throw errorHandler({ statusCode: 411, message: "Invalid Inputs" });
    }

    const hashedPassword = bcryptjs.hashSync(body.password, 10);

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
      log: ["query", "error", "info", "warn"],
    }).$extends(withAccelerate());

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
        profilePicture: body.profilePicture,
      },
    });

    const { password, ...rest } = user;
    return c.json({ rest });
  } catch (error: any) {
    return catchErrorHandler(c, error);
  }
});

userRouter.delete("/delete/:userId", authMiddleware, async (c) => {
  if (c.get("userId") != c.req.param("userId")) {
    throw errorHandler({
      statusCode: 403,
      message: "You are not allowed to delete this user",
    });
  }

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
      log: ["query", "error", "info", "warn"],
    }).$extends(withAccelerate());

    await prisma.user.delete({
      where: { id: c.get("userId") },
    });

    c.status(200);
    return c.json("User Deleted Successfully");
  } catch (error: any) {
    // console.log("Error during user creation:", error);
    return catchErrorHandler(c, error);
  }
});

userRouter.get("/:userId", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
      log: ["error", "info", "query", "warn"],
    }).$extends(withAccelerate());

    const user = await prisma.user.findUnique({
      where: { id: c.req.param("userId") },
    });

    if (!user) {
      throw errorHandler({ statusCode: 404, message: "User Not Found" });
    }

    const { password, ...rest } = user;

    return c.json({ user: rest });
  } catch (error) {
    return catchErrorHandler(c, error);
  }
});
