import React, { useState, useEffect } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { RootStackParams } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type Props = NativeStackScreenProps<RootStackParams, "Kierunek">;

export default function Direction({ route }: Props) {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const [direction, setdirection] = useState<[number, string, string]>([
    0,
    "",
    "",
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `http://192.168.1.23:8080/busstop/direction/get/${route.params.bus_line_id}`
      );
      const data = await res.json();
      setdirection(data);
    };
    fetchData();
  }, [route]);

  return (
    <View style={styles.container}>
      <Button
        style={{
          flex: 1,
          margin: 20,
          borderWidth: 3, // Grubość obramowania
          borderColor: "black", // Kolor obramowania
          borderRadius: 10,
          minHeight: "40%",
          justifyContent: "center",
        }}
        onPress={() =>
          navigation.navigate("Przystanki", { id: direction[0], direction: 1 })
        }
      >
        <Text
          style={{
            fontSize: 20,
            justifyContent: "center",
            color: "black",
          }}
        >
          {direction?.[1]}
        </Text>
      </Button>
      <Button
        style={{
          flex: 1,
          margin: 20,
          borderWidth: 3, // Grubość obramowania
          borderColor: "black", // Kolor obramowania
          borderRadius: 10,
          justifyContent: "center",
          minHeight: "40%",
        }}
        onPress={() =>
          navigation.navigate("Przystanki", { id: direction[0], direction: 2 })
        }
      >
        <Text
          style={{
            fontSize: 20,

            justifyContent: "center",
            color: "black",
          }}
        >
          {direction?.[2]}
        </Text>
      </Button>
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
