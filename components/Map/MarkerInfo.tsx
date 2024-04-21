import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    <View style={styles.container}>
      {params.markers[params.selectRoute][params.selectedMarker].map(
        (m, index) => (
          <View
            key={index}
            style={{
              display: "flex",
              alignContent: "center",
            }}
          >
            <View style={{ padding: 5 }}>
              <Text>{`Przystanek: ${params.selectedMarker}`}</Text>
              <Text>{`Godzina: ${m[2]}`}</Text>
              <Text>{`linia: ${m[3]}`}</Text>
              <Text>{`kierunek: ${m[4]}`}</Text>
            </View>
          </View>
        )
      )}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => params.handleMarkerClick("")}
      >
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: "40%",
    position: "absolute",
    backgroundColor: "#FDF5F6",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    padding: 8,
    borderWidth: 1, // Grubość ramki
    borderColor: "black", // Kolor ramki
  },
  closeButton: {
    padding: 2,
    marginTop: 10,
    alignItems: "center",
    width: "40%",
    alignSelf: "center",
    backgroundColor: "black",
    opacity: 0.8,
    borderRadius: 8,
  },
  closeText: { color: "white" },
});
