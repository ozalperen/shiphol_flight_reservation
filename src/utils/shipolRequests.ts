import fetch from "node-fetch";
import config from "config";
import { IsNull } from "typeorm";

const baseUrl: string = "https://api.schiphol.nl/public-flights/flights";
const path: string = "/flights";

export const schipholapiSearchRequest = async (
  flightDirection: string,
  route: string,
  fromScheduleDate: string,
  toScheduleDate: string
) => {
  try {
    const response = await fetch(
      baseUrl +
        "?flightDirection=" +
        flightDirection +
        "&route=" +
        route +
        "&fromScheduleDate=" +
        fromScheduleDate +
        "&toScheduleDate=" +
        toScheduleDate +
        "&sort=%2BscheduleTime",
      {
        method: "GET",
        headers: {
          app_id: config.get<string>("app_id"),
          app_key: config.get<string>("app_key"),
          Accept: "application/json",
          ResourceVersion: "v4",
        },
      }
    );
    if (response.status === 200) {
      const data: JSON = await response.json();
      return data;
    }
  } catch (err: any) {}
};
