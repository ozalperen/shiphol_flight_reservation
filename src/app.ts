require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import config from "config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AppDataSource } from "./utils/data-source";
import AppError from "./utils/appError";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import flightRouter from "./routes/flight.routes";
import bookingRouter from "./routes/booking.routes";
import validateEnv from "./utils/validateEnv";
import redisClient from "./utils/connectRedis";
import { apiLimiter } from "./middleware/limiter";

AppDataSource.initialize()
  .then(async () => {
    // VALIDATE ENV
    validateEnv();

    const app = express();

    // TEMPLATE ENGINE
    app.set("view engine", "pug");
    app.set("views", `${__dirname}/views`);

    // MIDDLEWARE

    // 1. Body parser
    app.use(express.json({ limit: "10kb" }));

    // 2. Logger
    if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

    // 3. Cookie Parser
    app.use(cookieParser());

    // 4. Cors
    let origin = config.get<string>("developmentOrigin");
    if (process.env.NODE_ENV === "production") {
      origin = config.get<string>("productionOrigin");
    }
    app.use(
      cors({
        origin: origin,
        credentials: true,
      })
    );

    //5. Limiter
    // app.set('trust proxy', 1)
    app.use(apiLimiter);

    // ROUTES

    app.use("/api/auth", authRouter);
    app.use("/api/users", userRouter);
    app.use("/api/flights", flightRouter);
    app.use("/api/bookings", bookingRouter);

    // HEALTH CHECKER
    app.get("/api/healthChecker", async (_, res: Response) => {
      const message = await redisClient.get("try");

      res.status(200).json({
        status: "success",
        message,
      });
    });

    // UNHANDLED ROUTE
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    // GLOBAL ERROR HANDLER
    app.use(
      (error: AppError, req: Request, res: Response, next: NextFunction) => {
        error.status = error.status || "error";
        error.statusCode = error.statusCode || 500;

        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );

    const port = config.get<number>("port");
    app.listen(port);

    console.log(`Server started on port: ${port}`);
  })
  .catch((error) => console.log(error));
