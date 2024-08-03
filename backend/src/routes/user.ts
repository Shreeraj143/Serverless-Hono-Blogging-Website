import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { signinInput, signupInput } from "@shreeraj1811/medium-common";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import bcryptjs, { hash } from "bcryptjs";
import { errorHandler } from "../utils/error";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
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
