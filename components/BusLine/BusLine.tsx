import React from "react";
import { busLine } from "./types";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StyleSheet } from "react-native";
import { Card, Button } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParams } from "../../App";
import { useNavigation } from "@react-navigation/native";
import CardWrapper from "./CardWrapper";

const Type = {
  BUS: 1,
  TRAM: 2,
  SUBWAY: 3,
};
export default function BusLine() {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const [busLines, setBusLines] = useState<busLine[]>([]);
  const [type, setType] = useState<string>(Object.keys(Type)[0]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://192.168.1.23:8080/busline/get/${type}`);
      const data = await res.json();
      setBusLines(data);
    };
    fetchData();
  }, [type]);
  const handleTypeChange = (newType: string) => {
    setType(newType);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity
          style={[styles.typeButton, type === "BUS" && styles.activeButton]}
          onPress={() => handleTypeChange("BUS")}
        >
          <Text style={styles.buttonText}>BUS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === "TRAM" && styles.activeButton]}
          onPress={() => handleTypeChange("TRAM")}
        >
          <Text style={styles.buttonText}>TRAM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === "SUBWAY" && styles.activeButton]}
          onPress={() => handleTypeChange("SUBWAY")}
        >
          <Text style={styles.buttonText}>SUBWAY</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={busLines}
        renderItem={({ item }) => <CardWrapper prop={item} />}
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
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: "#61dafb",
    width: "30%",
  },
  activeButton: {
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
});
