import React from "react";
import { busStop } from "./types";
import { useState, useEffect } from "react";
import { Text, View, FlatList } from "react-native";

export default function BusStops() {
  const [busStops, setBusStops] = useState<busStop[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://192.168.1.23:8080/busstop/get");
      const data = await res.json();
      setBusStops(data);
    };
    fetchData();
  }, []);
  console.log(busStops);
  return (
    <View>
      <FlatList
        data={busStops}
        renderItem={({ item }) => <Text>{item.id}</Text>}
      ></FlatList>
    </View>
  );
}
