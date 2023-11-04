import React from "react";
import { Button, StyleSheet, View } from "react-native";
import Footer from "../Footer/Footer";
const MainLayout = () => {
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: "column",
        },
      ]}
    >
      <View style={{ flex: 2, backgroundColor: "blue" }}></View>
      <View style={{ flex: 5, backgroundColor: "red" }}></View>
      <View style={{ flex: 1, backgroundColor: "blue" }}>
        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MainLayout;
