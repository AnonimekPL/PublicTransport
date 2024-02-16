import React from "react";
import { busLine } from "./types";
import { useState, useEffect } from "react";
import { Text, View, FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { Card, Button } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParams } from "../../App";
import { useNavigation } from "@react-navigation/native";
import CardWrapper from "./CardWrapper";

export default function BusLine() {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const [busLines, setBusLines] = useState<busLine[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://192.168.1.23:8080/busline/get");
      const data = await res.json();
      setBusLines(data);
    };
    fetchData();
  }, []);

  // const renderData = (busLine: busLine) => {
  //   return (
  //     <Card style={{ minHeight: 60, margin: 10, justifyContent: "center" }}>
  //       <View>
  //         <Button
  //           onPress={() => navigation.navigate("BusStop", { id: busLine.id })}
  //         >
  //           <Text style={styles.text}>{busLine.line_name}</Text>
  //         </Button>
  //       </View>
  //     </Card>
  //   );
  // };

  return (
    <View style={styles.container}>
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
});
