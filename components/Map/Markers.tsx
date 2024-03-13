import React, { useState } from "react";
import { markerResult } from "../types";
import { Marker } from "react-native-maps";

type prop = {
  markers: markerResult;
  selectRoute: number;
  handleMarkerClick: (markerKey: string) => void;
};
export default function Markers(params: prop) {
  return (
    <>
      {params.markers &&
        Object.keys(params.markers[params.selectRoute]).map((key) => (
          <Marker
            key={key}
            coordinate={{
              latitude: params.markers[params.selectRoute][key][0][0],
              longitude: params.markers[params.selectRoute][key][0][1],
            }}
            title={`Przystanek ${key}`}
            onPress={() => params.handleMarkerClick(key)}
          />
        ))}
    </>
  );
}
