import React, { useState, useEffect } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { RootStackParams } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { busStop } from "./types";
import BusStopCard from "./BusStopCard";
type Props = NativeStackScreenProps<RootStackParams, "Przystanki">;

export default function BusStopID({ route }: Props) {
  const [busStops, setBusStops] = useState<busStop[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `http://192.168.1.23:8080/busstop/get/${route.params.id}/${route.params.direction}`
      );
      const data = await res.json();
      setBusStops(data);
    };
    fetchData();
  }, [route]);

  return (
    <View style={styles.container}>
      <FlatList
        data={busStops}
        renderItem={({ item }) => <BusStopCard prop={item} />}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#eaeaea",
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
