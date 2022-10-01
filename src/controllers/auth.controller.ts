import { CookieOptions, NextFunction, Request, Response } from "express";
import config from "config";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import {
  CreateUserInput,
  LoginUserInput,
  VerifyEmailInput,
  UpdatePasswordSchema,
  UpdatePasswordInput,
} from "../schemas/user.schema";
import {
  createUser,
  findUser,
  findUserByEmail,
  findUserById,
  signTokens,
} from "../services/user.service";
import AppError from "../utils/appError";
import redisClient from "../utils/connectRedis";
import { signJwt, verifyJwt } from "../utils/jwt";
import { User } from "../entities/user.entity";
import Email from "../utils/email";

export const excludedFields = ["password"];

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
};
let origin = config.get<string>("developmentHost");
if (process.env.NODE_ENV === "production") {
  origin = config.get<string>("productionOrigin");
}

if (process.env.NODE_ENV === "production") {
  cookiesOptions.secure = true;
  cookiesOptions.domain = config.get<string>("productionCookieDomain");
} else {
  cookiesOptions.domain = config.get<string>("developmentCookieDomain");
}

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("refreshTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("refreshTokenExpiresIn") * 60 * 1000,
};

export const registerUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, password, email } = req.body;

    const newUser = await createUser({
      name,
      email: email.toLowerCase(),
      password,
    });

    const { hashedVerificationCode, verificationCode } =
      User.createVerificationCode();
    newUser.verificationCode = hashedVerificationCode;
    await newUser.save();

    // Send Verification Email

    const redirectUrl = origin + `/api/auth/verifyemail/${verificationCode}`;

    try {
      await new Email(newUser, redirectUrl).sendVerificationCode();
      res.status(201).json({
        status: "success",
        message:
          "An email with a verification code has been sent to your email",
      });
    } catch (error) {
      newUser.verificationCode = null;
      await newUser.save();

      return res.status(500).json({
        status: "error",
        message: "There was an error sending email, please try again",
      });
    }
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({
        status: "fail",
        message: "User with that email already exist",
      });
    }
    next(err);
  }
};

export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail({ email });

    // 1. Check if user exist
    if (!user) {
      return next(new AppError(400, "Invalid email or password"));
    }

    // 2.Check if user is verified
    if (!user.verified) {
      return next(
        new AppError(
          401,
          "You are not verified, check your email to verify your account"
        )
      );
    }

    //3. Check if password is valid
    if (!(await User.comparePasswords(password, user.password))) {
      return next(new AppError(400, "Invalid email or password"));
    }

    // 4. Sign Access and Refresh Tokens
    const { access_token, refresh_token } = await signTokens(user);

    // 5. Add Cookies
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // 6. Send response
    res.status(200).json({
      status: "success",
      access_token,
      refresh_token,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updatePasswordHandler = async (
  req: Request<{}, {}, UpdatePasswordInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const passwordUpdateCode = crypto
      .createHash("sha256")
      .update(req.body.passwordUpdateCode)
      .digest("hex");

    const { email, password } = req.body;
    let haspassword = await bcrypt.hash(password, 12);

    const user = await findUser({ email });

    // 1. Check if user exist
    if (!user) {
      return next(new AppError(400, "Invalid email"));
    }

    // 2.Check if user is verified
    if (!user.verified) {
      return next(
        new AppError(
          401,
          "You are not verified, check your email to verify your account"
        )
      );
    }

    if (passwordUpdateCode === user.passwordUpdateCode) {
      user.passwordUpdateCode = null;
      user.password = haspassword;
      await user.save();

      res.status(201).json({
        status: "success",
        message:
          "Your password has been updated. Please login with your new password.",
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Your password reset code is not valid.",
      });
    }
  } catch (err: any) {
    next(err);
  }
};

export const verifyEmailHandler = async (
  req: Request<VerifyEmailInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const verificationCode = crypto
      .createHash("sha256")
      .update(req.params.verificationCode)
      .digest("hex");

    const user = await findUser({ verificationCode });

    if (!user) {
      return next(new AppError(401, "Could not verify email"));
    }

    user.verified = true;
    user.verificationCode = null;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (err: any) {
    next(err);
  }
};

export const forgotPasswordHandler = async (
  req: Request<VerifyEmailInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail({ email });

    // 1. Check if user exist
    if (!user) {
      return next(new AppError(400, "Invalid email"));
    }
    if (!user.verified) {
      return next(
        new AppError(
          401,
          "Your email has not been verified. Please verify your email."
        )
      );
    }
    // create password update code
    const { hashedPasswordUpdateCode, passwordUpdateCode } =
      User.createPasswordUpdateCode();
    user.passwordUpdateCode = hashedPasswordUpdateCode;
    await user.save();

    // Send Verification Email

    try {
      await new Email(user, passwordUpdateCode).sendPasswordUpdateCode();
      res.status(201).json({
        status: "success",
        message:
          "An email with a verification code has been sent to your email",
      });
    } catch (error) {
      user.verificationCode = null;
      await user.save();

      return res.status(500).json({
        status: "error",
        message: "There was an error sending email, please try again",
      });
    }
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({
        status: "fail",
        message: "User with that email already exist",
      });
    }
    next(err);
  }
};

export const resendVerifyHandler = async (
  req: Request<VerifyEmailInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail({ email });

    // 1. Check if user exist
    if (!user) {
      return next(new AppError(400, "Invalid email"));
    }
    if (user.verified) {
      return next(new AppError(401, "Your email has been verified."));
    }
    // Renew verification code
    const { hashedVerificationCode, verificationCode } =
      User.createVerificationCode();
    user.verificationCode = hashedVerificationCode;
    await user.save();

    // Send Verification Email
    const redirectUrl = origin + `/api/auth/verifyemail/${verificationCode}`;

    try {
      await new Email(user, redirectUrl).sendVerificationCode();

      res.status(201).json({
        status: "success",
        message:
          "An email with a verification code has been sent to your email",
      });
    } catch (error) {
      user.verificationCode = null;
      await user.save();

      return res.status(500).json({
        status: "error",
        message: "There was an error sending email, please try again",
      });
    }
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({
        status: "fail",
        message: "User with that email already exist",
      });
    }
    next(err);
  }
};

export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    const message = "Could not refresh access token";

    if (!refresh_token) {
      return next(new AppError(403, message));
    }

    // Validate refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refresh_token,
      "refreshTokenPublicKey"
    );

    if (!decoded) {
      return next(new AppError(403, message));
    }

    // Check if user has a valid session
    const session = await redisClient.get(decoded.sub);

    if (!session) {
      return next(new AppError(403, message));
    }

    // Check if user still exist
    const user = await findUserById(JSON.parse(session).id);

    if (!user) {
      return next(new AppError(403, message));
    }

    // Sign new access token
    const access_token = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
    });

    // 4. Add Cookies
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // 5. Send response
    res.status(200).json({
      status: "success",
      access_token,
    });
  } catch (err: any) {
    next(err);
  }
};

const logout = (res: Response) => {
  res.cookie("access_token", "", { maxAge: 1 });
  res.cookie("refresh_token", "", { maxAge: 1 });
  res.cookie("logged_in", "", { maxAge: 1 });
};

export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    await redisClient.del(user.id);
    logout(res);

    res.status(200).json({
      status: "success",
    });
  } catch (err: any) {
    next(err);
  }
};
