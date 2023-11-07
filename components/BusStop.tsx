import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { Card } from "react-native-paper";

type BusStopProps = {
  id: number;
};

function BusStop(id: BusStopProps) {
  console.log(id);
  const [data, setData] = useState<item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  type item = {
    id: number;
    name: string;
    xPos: number;
    yPos: number;
  };
  useEffect(() => {
    // Wykonaj żądanie Fetch na podstawie przekazanego ID
    fetch(`http://192.168.1.23:8080/busstop/get/${id.id}`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((bus_stop) => {
        setData(bus_stop);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych:", error);
        setIsLoading(false);
      });
  }, [id]);
  console.log(data);
  if (isLoading) {
    return <Text>Ładowanie...</Text>;
  }

  return (
    <View>
      {data ? (
        <Card>
          <Text>{data.name}</Text>
          <Text>{data.xPos}</Text>
          <Text>{data.yPos}</Text>
        </Card>
      ) : (
        <Text>Brak danych dla ID: {id as never}</Text>
      )}
    </View>
  );
}

export default BusStop;
