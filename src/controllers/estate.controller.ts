import { NextFunction, Request, Response } from "express";
import { Estate } from "../entities/estate.entity";
import { User } from "../entities/user.entity";
import { CreateEstateInput } from "../schemas/estate.schema";
import { findUserById } from "../services/user.service";
import { createEstate } from "../services/estate.service";

export const createEstateHandler = async (
    req: Request<{}, {}, CreateEstateInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const user = await findUserById(res.locals.user.id as string);
        const estate = await createEstate(req.body, user!);
        res.status(201).json({
            status: "success",
            data: {
              estate,
              user
            },
          });
        } catch (err: any) {
          if (err.code === "23505") {
            return res.status(409).json({
              status: "fail",
              message: "Estate with that name already exist",
            });
          }
          next(err);
        }
      };