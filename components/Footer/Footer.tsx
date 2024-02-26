import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { max } from "rxjs";

const screenWidth = Dimensions.get("window").width;

const Footer = () => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "80%",
      }}
    >
      <View>
        <Image
          style={{ resizeMode: "contain" }}
          source={require("my-app/assets/hamburger_icon.png")}
        />
      </View>
      <View>
        <Image
          style={{ resizeMode: "contain" }}
          source={require("my-app/assets/homeicon.png")}
        />
      </View>
      <View>
        <Image
          style={{ resizeMode: "contain" }}
          source={require("my-app/assets/account_icon.png")}
        />
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
