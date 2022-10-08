import { date, number, object, string, TypeOf, z } from "zod";

export const createBookingSchema = object({
  body: object({
    scipholid: string({
      required_error: "scipholid is required",
    }),
    seatNumber: string({
      required_error: "seat number is required",
    }),
  }),
});

const params = {
  params: object({
    bookingId: string(),
  }),
};
export const deleteBookingSchema = object({
  ...params,
});

export const getBookingSchema = object({
  ...params,
});

export type CreateBookingInput = TypeOf<typeof createBookingSchema>["body"];
export type DeleteBookingInput = TypeOf<typeof deleteBookingSchema>["params"];
export type GetBookingInput = TypeOf<typeof getBookingSchema>["params"];
