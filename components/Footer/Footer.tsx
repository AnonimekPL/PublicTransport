import React from "react";
import { StyleSheet, View } from "react-native";

const Footer = () => {
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: "row",
        },
      ]}
    >
      <View>
        <a target="_blank" href="https://icons8.com/icon/aoYTy8DccxdA/menu">
          Menu
        </a>{" "}
        icon by{" "}
        <a target="_blank" href="https://icons8.com">
          Icons8
        </a>
      </View>
    </View>
  );
};

export default Footer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
