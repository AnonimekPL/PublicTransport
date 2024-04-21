import React from "react";
import { FlatList } from "react-native";
import { RouteItem } from "../types";
import { Button, Text } from "react-native-paper";

type params = {
  data: RouteItem[];
  setSelectRoute: React.Dispatch<React.SetStateAction<number>>;
  selectRoute: number;
  handleMarkerClick: (markerKey: string) => void;
};

type renderItemProps = {
  item: RouteItem;
  setSelectRoute: React.Dispatch<React.SetStateAction<number>>;
  selectRoute: number;
  handleMarkerClick: (markerKey: string) => void;
};
// handleMarkerClick: (markerKey: string) => void; musze dodac
const renderItem = ({
  item,
  setSelectRoute,
  selectRoute,
  handleMarkerClick,
}: renderItemProps) => (
  <Button
    onPress={() => (setSelectRoute(item.key), handleMarkerClick(""))}
    style={{
      display: "flex",
      justifyContent: "space-around",
      shadowOpacity: 0.4,
      backgroundColor: item.key === selectRoute ? "#61DAFB" : "white",
    }}
  >
    <Text>{item.key + 1}</Text>
  </Button>
);

export default function ShowAlternativeRoutes({
  data,
  setSelectRoute,
  selectRoute,
  handleMarkerClick,
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
        renderItem({ item, setSelectRoute, selectRoute, handleMarkerClick })
      }
      keyExtractor={(item) => item.key.toString()}
      horizontal={true}
    />
  );
}
