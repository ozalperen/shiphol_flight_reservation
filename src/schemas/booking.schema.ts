import { date, number, object, string, TypeOf, z } from "zod";


export const createBookingSchema = object({
    body: object({
        scipholid: string({
        required_error: 'scipholid is required',
      }),
      seatNumber: string({
        required_error: 'seat number is required',
      }),
    }),
  });

export type CreateBookingInput = TypeOf<typeof createBookingSchema>["body"];

