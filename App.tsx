import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
// import Home from "./components/Home";
// import BusStop from "./components/BusStop";
import BusStopID from "./components/BusStops/BusStopID";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BusLine from "./components/BusLine/BusLine";
import BusStops from "./components/BusStops/BusStops";
import ScheduleID from "./components/Schedule/ScheduleID";
import Footer from "./components/Footer/Footer";

import Direction from "./components/BusStops/Direction";

import Map4 from "./components/Map4";
export type RootStackParams = {
  Kierunek: {
    bus_line_id: number;
  };
  Trasy: {};
  Przystanki: {
    id: number;
    direction: number;
  };
  Rozkład: {
    bus_stop_id: number;
  };
  Mapa: {
    id: number;
  };
};
const RootStack = createNativeStackNavigator<RootStackParams>();

const YourComponent = () => {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <View style={styles.NavigationContainer}>
          <RootStack.Navigator>
            <RootStack.Screen name="Mapa" component={Map4} />
            <RootStack.Screen name="Trasy" component={BusLine} />
            <RootStack.Screen name="Kierunek" component={Direction} />
            <RootStack.Screen name="Przystanki" component={BusStopID} />
            <RootStack.Screen name="Rozkład" component={ScheduleID} />
          </RootStack.Navigator>
        </View>
        <View style={styles.Footer}>
          <Footer />
        </View>
      </NavigationContainer>
    </View>
  );
};
// {/* <RootStack.Screen name="BusStops" component={BusStops} /> */}
// {/* <RootStack.Screen name="Schedule" component={Schedule} /> */}
const styles = StyleSheet.create({
  NavigationContainer: {
    height: "90%",
  },
  Footer: {
    height: "10%",
  },
  bottomContainer: {
    backgroundColor: "lightgray",
    padding: 10,
    alignItems: "center",
  },
  bottomText: {
    fontSize: 20,
    color: "black",
  },
});

export default YourComponent;
