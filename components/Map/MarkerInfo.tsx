import React from "react";
import { Text, View } from "react-native";
import { markerResult } from "../types";
import { Button } from "react-native-paper";
type prop = {
  markers: markerResult;
  selectRoute: number;
  selectedMarker: string;
  handleMarkerClick: (markerKey: string) => void;
};
export default function MarkerInfo(params: prop) {
  return (
    <View
      style={{
        flex: 1,
        top: "50%",
        position: "absolute",
        backgroundColor: "pink",
      }}
    >
      {params.markers[params.selectRoute][params.selectedMarker].map(
        (m, index) => (
          <View
            key={index}
            style={{
              display: "flex",
              alignContent: "center",
            }}
          >
            <Text>{`Przystanek ${params.selectedMarker}`}</Text>
            <Text>{`Godzina ${m[2]}`}</Text>
            <Text>{`linia ${m[3]}`}</Text>
            <Text>{`nazwa linii ${m[4]}`}</Text>
          </View>
        )
      )}
      <Button onPress={() => params.handleMarkerClick("")}>CLOSE</Button>
    </View>
  );
}
