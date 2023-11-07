import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Button,
} from "react-native";
import Home from "./components/Home";
import BusStop from "./components/BusStop";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

function HomeScreen() {
  const navigation = useNavigation();
  const x: number = 1;
  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: "#eeeeee", flex: 0.9 }}>
        <BusStop id={3}></BusStop>
      </View>
      <View style={{ backgroundColor: "#bdbdbd", flex: 0.1 }}>
        <Button
          title="Go to Details"
          onPress={() => navigation.navigate("Details" as never)}
        />
      </View>
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>
    </View>
  );
}
const Stack = createNativeStackNavigator();

const YourComponent = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    flex: 1,
    flexDirection: "column",
    //backgroundColor: "#fff",
    //alignItems: "center",
    //justifyContent: "center",
  },
});

export default YourComponent;
