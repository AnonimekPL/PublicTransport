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
import Schedule from "./components/Schedule/Schedule";
import Direction from "./components/BusStops/Direction";
export type RootStackParams = {
  Direction: {
    bus_line_id: number;
  };
  BusLine: any;
  Schedule: any;
  BusStops: any;
  // Home: any;
  Details: any;
  BusStopID: {
    id: number;
    direction: number;
  };
  ScheduleID: {
    bus_stop_id: number;
  };
};
const RootStack = createNativeStackNavigator<RootStackParams>();

const YourComponent = () => {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <View style={{ height: "90%" }}>
          <RootStack.Navigator>
            {/* <RootStack.Screen name="Schedule" component={Schedule} /> */}
            <RootStack.Screen name="BusLine" component={BusLine} />
            <RootStack.Screen name="Direction" component={Direction} />
            <RootStack.Screen name="BusStops" component={BusStops} />
            <RootStack.Screen name="BusStopID" component={BusStopID} />
            <RootStack.Screen name="ScheduleID" component={ScheduleID} />
          </RootStack.Navigator>
        </View>
      </NavigationContainer>
      <View style={{ height: "10%" }}>
        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
