import { object, string, TypeOf, z, array } from "zod";
export const createEstateSchema = object({
  body: object({
    name: string({
      required_error: "Estate name is required",
    }),
    address: string({
      required_error: "Estate address is required",
    }),
    picture: string({
      required_error: "Estate pictogram is required",
    }),
  }),
});

export type CreateEstateInput = TypeOf<typeof createEstateSchema>["body"];