import React from "react";
import { FlatList } from "react-native";
import { RouteItem } from "../types";
import { Button, Text } from "react-native-paper";

type params = {
  data: RouteItem[];
  setSelectRoute: React.Dispatch<React.SetStateAction<number>>;
  selectRoute: number;
};

type renderItemProps = {
  item: RouteItem;
  setSelectRoute: React.Dispatch<React.SetStateAction<number>>;
  selectRoute: number;
};

const renderItem = ({ item, setSelectRoute, selectRoute }: renderItemProps) => (
  <Button
    onPress={() => setSelectRoute(item.key)}
    style={{
      display: "flex",
      justifyContent: "space-around",
      shadowOpacity: 0.4,
      backgroundColor: item.key === selectRoute ? "grey" : "white",
    }}
  >
    <Text>{item.key + 1}</Text>
  </Button>
);

export default function ShowAlternativeRoutes({
  data,
  setSelectRoute,
  selectRoute,
}: params) {
  return (
    <FlatList
      style={{
        padding: 5,
        display: "flex",
        position: "absolute",
        backgroundColor: "white",
        bottom: 0,
      }}
      data={data}
      renderItem={({ item }) =>
        renderItem({ item, setSelectRoute, selectRoute })
      }
      keyExtractor={(item) => item.key.toString()}
      horizontal={true}
    />
  );
}
