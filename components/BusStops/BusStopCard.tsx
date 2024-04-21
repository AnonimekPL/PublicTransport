import React from "react";
import { useState, useEffect } from "react";
import { RootStackParams } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Card, Button } from "react-native-paper";
import { busStop } from "./types";

export default function BusStopCard({ prop }: { prop: busStop }) {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const screenWidth = Dimensions.get("window").width;
  const sizeBasedOnWidth = screenWidth * 0.05;
  return (
    <Card style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 2 }}>
          <Button
            onPress={() =>
              navigation.navigate("Rozkład", { bus_stop_id: prop.id })
            }
          >
            <Text style={styles.text}>{prop.name}</Text>
          </Button>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            borderWidth: 1,
            marginEnd: 10,
          }}
        >
          <Button
            style={{ width: "100%" }}
            onPress={() => navigation.navigate("Mapa", { id: prop.id })}
          >
            <Text style={{ fontSize: sizeBasedOnWidth }}>View</Text>
          </Button>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    margin: 10,
    justifyContent: "center",
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#61dafb",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
  text: {
    color: "black",
    fontSize: 20,
    textAlign: "center",
  },
});
