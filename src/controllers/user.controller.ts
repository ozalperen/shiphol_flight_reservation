import { NextFunction, Request, Response } from 'express';
import { findUserById } from '../services/user.service';
import {getMembershipInput} from '../schemas/user.schema';
import {UpdateUserInput} from '../schemas/user.schema'
import AppError from '../utils/appError';
export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let user = await res.locals.user;
    delete user.password;
    delete user.verificationCode;
    delete user.passwordUpdateCode;
    res.status(200).status(200).json({
      status: 'success',
      data: {
        user,

      },
    });
  } catch (err: any) {
    next(err);
  }
};

  export const updateUserHandler = async (
    req: Request<{}, {}, UpdateUserInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let user = await res.locals.user;
  
      if (!user) {
        return next(new AppError(404, 'User with that ID not found'));
      }
  if (user.name){
      user.name = await req.body.name;
  }
  try {
  if (user.nickname) {
      user.nickname = await req.body.nickname;
  }
  } catch (err: any) {
    return next(new AppError(400, 'Username already exists'));
  }

      const updatedUser = await user.save();

  
      res.status(200).json({
        status: 'success',
        data: {
          user: updatedUser
        },
      });
    } catch (err: any) {
      next(err);
    }
  };
