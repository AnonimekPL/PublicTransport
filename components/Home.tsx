import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native";
import { Card } from "react-native-paper";
function Home() {
  const [data, setData] = useState();
  type item = {
    id: number;
    name: string;
    xPos: number;
    yPos: number;
  };
  useEffect(() => {
    fetch("http://192.168.1.23:8081/busstop/get", {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((bus_stop) => {
        setData(bus_stop);
      });
  }, []);

  const renderData = (item: item) => {
    return (
      <Card>
        <Text>{item.name}</Text>
        <Text>{item.xPos}</Text>
      </Card>
    );
  };

  return (
    <View>
      <FlatList
        style={{ flex: 1 }}
        data={data}
        renderItem={({ item }) => {
          return renderData(item);
        }}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  );
}

export default Home;
