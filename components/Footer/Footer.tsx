import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { max } from "rxjs";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { RootStackParams } from "../../App";

const screenWidth = Dimensions.get("window").width;

const Footer = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
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
        <TouchableOpacity onPress={() => navigation.navigate("Trasy")}>
          <Image source={require("my-app/assets/hamburger_icon.png")} />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("Mapa")}>
          <Image source={require("my-app/assets/homeicon.png")} />
        </TouchableOpacity>
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
