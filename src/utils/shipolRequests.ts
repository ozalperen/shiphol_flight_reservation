import fetch from "node-fetch";
import config from "config";

const baseUrl: string ="https://api.schiphol.nl/public-flights/flights";
const path: string = "/flights"

export const schipholapiRequest = async (
  path: string,

) => {

try {

      const response = await fetch( baseUrl, {
        method: 'GET',
        headers: {
          app_id: config.get<string>("app_id"),
          app_key: config.get<string>("app_key"),
          Accept: 'application/json',
          ResourceVersion: 'v4',
          flightDirection: 'D',
          route: 'SAW',
          fromScheduleDate: '2022-10-02',
          toScheduleDate: '2022-10-03'
        },
      });
      const data = await response.json();
      console.log(data);
}
catch (err: any) {
}
};