import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
// import Home from "./components/Home";
// import BusStop from "./components/BusStop";
import BusStopID from "./components/BusStops/BusStopID";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import BusLine from "./components/BusLine/BusLine";
import BusStops from "./components/BusStops/BusStops";

export type RootStackParams = {
  BusLine: any;
  Shedule: any;
  BusStops: any;
  // Home: any;
  Details: any;
  BusStopID: {
    id: number;
  };
};
const RootStack = createNativeStackNavigator<RootStackParams>();
const BusStopsStack = createNativeStackNavigator();

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
      <RootStack.Navigator>
        <RootStack.Screen name="BusLine" component={BusLine} />
        {/* <RootStack.Screen name="Home" component={Home} /> */}

        <RootStack.Screen name="BusStops" component={BusStops} />

        <RootStack.Screen name="Details" component={DetailsScreen} />
        <RootStack.Screen name="BusStopID" component={BusStopID} />
      </RootStack.Navigator>
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
