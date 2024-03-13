import polyline from "@mapbox/polyline";
import React from "react";
import { Polyline } from "react-native-maps";
import { routes_type } from "../types";

type prop = {
  routes: routes_type;
  selectRoute: number;
};

export default function Polylines({ routes, selectRoute }: prop) {
  return (
    <>
      {Object.keys(routes).length > 0 && (
        <React.Fragment>
          {routes[selectRoute].walking.length > 0 &&
            routes[selectRoute].walking.map((x, index) => (
              <Polyline
                key={`walking_${index}`}
                coordinates={polyline.decode(x).map((point) => ({
                  latitude: point[0],
                  longitude: point[1],
                }))}
                strokeWidth={4}
                strokeColor="#00f"
                lineDashPattern={[1, 1]}
              />
            ))}
          {routes[selectRoute].transit.length > 0 &&
            routes[selectRoute].transit.map((x, index) => (
              <Polyline
                key={`transit_${index}`}
                coordinates={polyline.decode(x).map((point) => ({
                  latitude: point[0],
                  longitude: point[1],
                }))}
                strokeColor="#f00"
                strokeWidth={4}
              />
            ))}
        </React.Fragment>
      )}
    </>
  );
}
