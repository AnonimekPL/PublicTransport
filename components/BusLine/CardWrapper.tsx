import React from "react";
import { busLine } from "./types";
import { Button, Card } from "react-native-paper";
import { StyleSheet, Text, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParams } from "../../App";
import { useNavigation } from "@react-navigation/native";
export default function CardWrapper({ prop }: { prop: busLine }) {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  return (
    <Card style={{ minHeight: 60, margin: 10, justifyContent: "center" }}>
      <View>
        <Button
          onPress={() =>
            navigation.navigate("Kierunek", { bus_line_id: prop.id })
          }
        >
          <Text style={styles.text}>{prop.line_name}</Text>
        </Button>
      </View>
    </Card>
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
