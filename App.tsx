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
import Map from "./components/Map";
import Map3 from "./components/Map3";
import Map4 from "./components/Map4";
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
  Map: any;
  Map3: any;
  Map4: any;
};
const RootStack = createNativeStackNavigator<RootStackParams>();

const YourComponent = () => {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <View style={{ height: "90%" }}>
          <RootStack.Navigator>
            {/* <RootStack.Screen name="Schedule" component={Schedule} /> */}
            <RootStack.Screen name="Map4" component={Map4} />
            <RootStack.Screen name="Map3" component={Map3} />
            <RootStack.Screen name="Map" component={Map} />
            <RootStack.Screen name="BusLine" component={BusLine} />
            <RootStack.Screen name="Direction" component={Direction} />
            <RootStack.Screen name="BusStops" component={BusStops} />
            <RootStack.Screen name="BusStopID" component={BusStopID} />
            <RootStack.Screen name="ScheduleID" component={ScheduleID} />
          </RootStack.Navigator>
        </View>
        <View style={{ height: "10%" }}>
          <Footer />
        </View>
      </NavigationContainer>
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
