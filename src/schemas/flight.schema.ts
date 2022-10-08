import { date, object, string, TypeOf, z } from "zod";
import { DirectionEnumType } from "../entities/flights.entity";

export const getFlightSchema = object({
  body: object({
    fromScheduleDate: string({
      required_error: "from schedule date is required",
    }),
    toScheduleDate: string({
      required_error: "to schedule date is required",
    }),
    route: string({
      required_error: "Target route is required",
    }),
    flightDirection: z.nativeEnum(DirectionEnumType),
  }),
});

export const createFlightSchema = object({
  scipholid: string({
    required_error: "from schedule date is required",
  }),
  flightName: string({
    required_error: "from schedule date is required",
  }),
  flightNumber: string({
    required_error: "from schedule date is required",
  }),
  ScheduleDate: date({
    required_error: "from schedule date is required",
  }),
  ScheduleDateTime: date({
    required_error: "to schedule date is required",
  }),
  ScheduleTime: date({
    required_error: "to schedule date is required",
  }),
  route: string({
    required_error: "Target route is required",
  }),
  flightDirection: z.nativeEnum(DirectionEnumType),
});
const params = {
  params: object({
    scipholid: string(),
  }),
};
export const getFlightbyIdSchema = object({
  ...params,
});

export type GetFlightInput = TypeOf<typeof getFlightSchema>["body"];
export type CreateFlightInput = TypeOf<typeof createFlightSchema>;
export type GetFlightbyIdInput = TypeOf<typeof getFlightbyIdSchema>["params"];
