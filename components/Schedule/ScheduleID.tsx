import React, { Key } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { RootStackParams } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { schedule } from "./type";
import { FlatList } from "react-native";

const WeekdayEnum = {
  WORKING_DAYS: 1,
  WEEKENDS_AND_BREAK: 2,
};

type Props = NativeStackScreenProps<RootStackParams, "Rozkład">;
export default function ScheduleID({ route }: Props) {
  const [schedule, setSchedule] = useState<{ [key: string]: string[] }>({});
  const [weekday, setWeekday] = useState<string>(Object.keys(WeekdayEnum)[0]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `http://192.168.1.23:8080/schedule/get/${route.params.bus_stop_id}/${weekday}`
      );
      const data = await res.json();
      setSchedule(data);
    };
    fetchData();
  }, [route, weekday]);

  const handleTypeChange = (newType: string) => {
    setWeekday(newType);
  };

  return (
    <View style={{ flex: 1, height: "100%" }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          style={[
            styles.typeButton,
            weekday === "WORKING_DAYS" && styles.activeButton,
          ]}
          onPress={() => handleTypeChange("WORKING_DAYS")}
        >
          <Text style={styles.buttonText}>Pon-Pt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            weekday === "WEEKENDS_AND_BREAK" && styles.activeButton,
          ]}
          onPress={() => handleTypeChange("WEEKENDS_AND_BREAK")}
        >
          <Text style={styles.buttonText}>Weekendy i święta</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 11 }}>
        {Object.keys(schedule).map((hour, hourIndex) => (
          <View
            key={hourIndex}
            style={{
              display: "flex",
              flexDirection: "row",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: hourIndex % 2 == 0 ? "white" : "#FAEBD7",
              position: "relative",
            }}
          >
            <Text style={Platform.OS === "ios" ? styles.text : styles.textA}>
              {Number(hour) < 10 ? "0" + hour : hour}
            </Text>
            <ScrollView horizontal={true}>
              {schedule[hour].map((minute, minuteIndex) => (
                <Text
                  key={minuteIndex}
                  style={Platform.OS === "ios" ? styles.text2 : styles.text2A}
                >
                  {Number(minute) < 10 ? "0" + minute : minute}
                </Text>
              ))}
            </ScrollView>

            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "black",
                width: "100%",
                position: "absolute",
                bottom: 0,
              }}
            />

            {hour === "0" && (
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: "black",
                  width: "100%",
                  position: "absolute",
                  top: 0,
                }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
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
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Cochin",
    fontWeight: "bold",
    marginLeft: 10,
  },
  textA: {
    color: "black",
    fontSize: 15,
    textAlign: "center",
    justifyContent: "center",
    fontWeight: "bold",
    marginLeft: 10,
  },
  text2: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Cochin",
    marginLeft: 10,
    paddingLeft: 10,
  },
  text2A: {
    color: "black",
    fontSize: 15,
    textAlign: "center",

    marginLeft: 20,
    // paddingLeft: 10,
  },
  typeButton: {
    justifyContent: "center",
    margin: 10,
    borderRadius: 6,
    backgroundColor: "#61dafb",
    width: "40%",
  },
  activeButton: {
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
