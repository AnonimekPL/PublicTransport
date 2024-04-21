import React from "react";
import { LatLng } from "react-native-maps";
import { GOOGLE_API_KEY } from "../../environments";
import { routes_type, markerResult } from "../types";
import { dane } from "../types";
import axios from "axios";
import { addArrayToKey } from "./addArrayToKey";
type transit_mode_type = {
  bus: boolean;
  subway: boolean;
  train: boolean;
  tram: boolean;
};
type props = {
  origin: LatLng | null;
  destination: LatLng | null;
  routes: routes_type;
  setRoutes: React.Dispatch<React.SetStateAction<routes_type>>;
  setMarkers: React.Dispatch<React.SetStateAction<markerResult | undefined>>;
  setSelectRoute: React.Dispatch<React.SetStateAction<number>>;
  date: Date;
  transit_routing_preference: string;
  transit_mode: transit_mode_type;
};

export const fetchDirections = async ({
  origin,
  destination,
  setRoutes,
  setMarkers,
  setSelectRoute,
  date,
  transit_routing_preference,
  transit_mode,
}: props) => {
  try {
    setRoutes({});
    setMarkers(undefined);
    const time_to_number = Math.floor(new Date(date).getTime() / 1000);
    let transitModeString = "";
    for (const mode in transit_mode) {
      if (
        transit_mode.hasOwnProperty(mode) &&
        transit_mode[mode as keyof transit_mode_type] === true
      ) {
        transitModeString += mode + "|";
      }
    }
    transitModeString = transitModeString.slice(0, -1);
    const response = await axios.get<dane>(
      "https://maps.googleapis.com/maps/api/directions/json",
      {
        params: {
          origin: `${origin?.latitude},${origin?.longitude}`,
          destination: `${destination?.latitude},${destination?.longitude}`,
          mode: "transit",
          alternatives: true,
          transit_routing_preference: transit_routing_preference,
          key: GOOGLE_API_KEY,
          departure_time: time_to_number,
          transit_mode: transitModeString,
        },
      }
    );
    setSelectRoute(0);
    response.data.routes.forEach((route, index) => {
      const walkingRoute: string[] = [];
      const transitRoute: string[] = [];

      route.legs.forEach((leg) => {
        leg.steps.forEach((step) => {
          if (step.transit_details) {
            transitRoute.push(step.polyline.points);
            const name = step.transit_details.arrival_stop.name;
            const name2 = step.transit_details.departure_stop.name;
            const location = step.transit_details.arrival_stop.location;
            const location2 = step.transit_details.departure_stop.location;
            const time = step.transit_details.arrival_time.text;
            const time2 = step.transit_details.departure_time.text;
            const short_name = step.transit_details.line.short_name;
            const long_name = step.transit_details.line.name;
            addArrayToKey({
              choice: index,
              key: name,
              arrayToAdd: [
                location.lat,
                location.lng,
                time,
                short_name,
                long_name,
              ],
              setMarkers: setMarkers,
            });

            addArrayToKey({
              choice: index,
              key: name2,
              arrayToAdd: [
                location2.lat,
                location2.lng,
                time2,
                short_name,
                long_name,
              ],
              setMarkers: setMarkers,
            });
          } else {
            walkingRoute.push(step.polyline.points);
          }
        });
      });

      setRoutes((prevRoutes) => ({
        ...prevRoutes,
        [index]: { walking: walkingRoute, transit: transitRoute },
      }));
    });
  } catch (error) {
    console.error("Error fetching directions:", error);
  }
};
