import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import {
  signinInput,
  signupInput,
  updateUser,
} from "@shreeraj1811/medium-common";
import { Hono } from "hono";
import { jwt, sign, verify } from "hono/jwt";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error";
import { blogRouter } from "./blog";

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
    // console.log("Error during user creation:", error);
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
});

userRouter.use("/update/*", async (c, next) => {
  const token = c.req.header("authorization") || localStorage.getItem("token");
  if (!token) {
    throw errorHandler({ statusCode: 401, message: "Unauthorized" });
  }
  try {
    const user = await verify(token, c.env.JWT_SECRET);
    console.log(user);
    if (user) {
      c.set("userId", user.id as string);
      await next();
    } else {
      throw errorHandler({ statusCode: 403, message: "You are not logged in" });
    }
  } catch (error) {
    throw errorHandler({ statusCode: 403, message: "You are not logged in" });
  }
});

userRouter.put("/update/:usrId", async (c) => {
  const { usrId } = c.req.param();
  const userId = c.get("userId");
  const body = await c.req.json();

  if (userId !== usrId) {
    throw errorHandler({
      statusCode: 403,
      message: "You are not allowed to update this user",
    });
  }

  if (body.username.includes(" ")) {
    throw errorHandler({
      statusCode: 400,
      message: "Username cannot contain spaces",
    });
  }

  const { success } = updateUser.safeParse(body);
  if (!success) {
    throw errorHandler({ statusCode: 411, message: "Invalid Inputs" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    log: ["query", "error", "info", "warn"],
  }).$extends(withAccelerate());

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      username: body.username,
      email: body.email,
      password: body.password,
      profilePicture: body.profilePicture,
    },
  });

  const { password, ...rest } = user;
  return c.json({ rest });
});
