import { object, string, TypeOf, z } from "zod";
import { RoleEnumType } from "../entities/user.entity";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    email: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),
    password: string({
      required_error: "Password is required",
    })
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: string({
      required_error: "Please confirm your password",
    }),
    role: z.optional(z.nativeEnum(RoleEnumType)),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),
    password: string({
      required_error: "Password is required",
    }).min(8, "Invalid email or password"),
  }),
});

export const verifyEmailSchema = object({
  params: object({
    verificationCode: string(),
  }),
});

export const getMembershipSchema = object({
  params: object({
    userId: string({
      required_error: "Email address is required",
    }),
  }),
});

export const ForgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),
  }),
});

export const UpdatePasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),
    passwordUpdateCode: string({
      required_error: "Password recovery code is required",
    }).min(5, "Invalid email or recovery code"),
    password: string({
      required_error: "Password is required",
    })
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: string({
      required_error: "Please confirm your password",
    }),
    role: z.optional(z.nativeEnum(RoleEnumType)),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>["body"],
  "passwordConfirm"
>;

export const updateUserSchema = object({
  body: object({
    name: string(),
    nickname: string(),
    photo: string(),
  }).partial(),
});

export type UpdateUserInput = TypeOf<typeof updateUserSchema>["body"];
export type LoginUserInput = TypeOf<typeof loginUserSchema>["body"];
export type UpdatePasswordInput = TypeOf<typeof UpdatePasswordSchema>["body"];
export type VerifyEmailInput = TypeOf<typeof verifyEmailSchema>["params"];
export type getMembershipInput = TypeOf<typeof getMembershipSchema>["params"];
export type forgotPasswordInput = TypeOf<typeof ForgotPasswordSchema>["body"];
