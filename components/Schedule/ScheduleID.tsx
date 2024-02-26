import React, { Key } from "react";
import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { RootStackParams } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { schedule } from "./type";
import { FlatList } from "react-native";

type Props = NativeStackScreenProps<RootStackParams, "ScheduleID">;
export default function ScheduleID({ route }: Props) {
  const [schedule, setSchedule] = useState<{ [key: string]: string[] }>({});
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `http://192.168.1.23:8080/schedule/get/${route.params.bus_stop_id}`
      );
      const data = await res.json();
      setSchedule(data);
    };
    fetchData();
  }, [route]);

  return (
    <View style={{ flex: 1, height: "100%" }}>
      {Object.keys(schedule).map((hour, index) => (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            height: "4.16%",
            alignItems: "center",
            backgroundColor: index % 2 == 0 ? "white" : "#FAEBD7",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20, marginLeft: 10 }}>
            {Number(hour) < 10 ? "0" + hour : hour}
          </Text>
          {schedule[hour].map((minute) => (
            <Text style={{ paddingLeft: 20, fontSize: 20 }}>
              {Number(minute) < 10 ? "0" + minute : minute}
            </Text>
          ))}
          {hour !== "23" && (
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "black",
                width: "100%",
                position: "absolute",
                bottom: 0,
              }}
            />
          )}
        </View>
      ))}
    </View>
  );
}
