import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from "react-native";
import InputAutocomplete from "./InputAutocomplete";
import Constants from "expo-constants";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { useState } from "react";
import { RadioButton, Checkbox } from "react-native-paper";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Button } from "react-native";
type transit_mode_type = {
  bus: boolean;
  subway: boolean;
  train: boolean;
  tram: boolean;
};
type prop = {
  onPlaceSelected: (
    details: GooglePlaceDetail | null,
    flag: "origin" | "destination"
  ) => void;
  fetchDirections: () => Promise<void>;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  date: Date;
  transit_routing_preference: string;
  setTransit_routing_preference: React.Dispatch<React.SetStateAction<string>>;
  transit_mode: transit_mode_type;
  setTransit_mode: React.Dispatch<React.SetStateAction<transit_mode_type>>;
  busStop: string | undefined;
};
export default function SearchContainer(params: prop) {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  // const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState<Date>();
  const [dateTime, setDateTime] = useState<Date>();

  const showDateTimePicker = () => {
    setShowPicker((prev) => !prev);
  };

  const hideDateTimePicker = () => {
    setShowPicker(false);
  };

  const handleDateChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || params.date;
    params.setDate(currentDate);
  };
  const handleTimeChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || params.date;
    console.log(selectedDate);
    // console.log(currentDate);
    setTime(currentDate);
    hideDateTimePicker();
    setShowDatePicker(true);
  };
  const handleDateTimeChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowDatePicker(false);
    let currentDate = selectedDate || params.date;
    if (time) {
      console.log(time);
      time.setHours(currentDate?.getHours());
      time.setMinutes(currentDate?.getMinutes());
    }
    params.setDate(currentDate);
  };

  return (
    <View style={styles.searchContainer}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "80%", padding: 15 }}>
          <InputAutocomplete
            placeholder="Wpisz punkt początkowy"
            onPlaceSelected={(details) => {
              params.onPlaceSelected(details, "origin");
            }}
            busStop={undefined}
          />
          <InputAutocomplete
            placeholder="Wpisz punkt końcowy"
            onPlaceSelected={(details) => {
              params.onPlaceSelected(details, "destination");
            }}
            busStop={params.busStop}
          />
        </View>

        <TouchableOpacity
          style={{
            alignSelf: "center",
            transform: [{ scale: 0.8 }],
          }}
          onPress={params.fetchDirections}
        >
          <Image source={require("my-app/assets/route_icon.png")} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{
          bottom: -4,
          position: "absolute",
          alignSelf: "center",

          transform: [{ scale: 0.75 }],
        }}
        onPress={() => setShowFilters((prev) => !prev)}
      >
        {showFilters ? (
          <Image source={require("my-app/assets/up_icon.png")} />
        ) : (
          <Image source={require("my-app/assets/down_icon.png")} />
        )}
      </TouchableOpacity>

      {showFilters && (
        <View>
          {Platform.OS === "ios" && (
            <View>
              <TouchableOpacity onPress={showDateTimePicker}>
                <Text
                  style={{
                    color: "#1957E0",
                    fontSize: 20,
                    textAlign: "center",
                    paddingBottom: 10,
                  }}
                >
                  Select Time
                </Text>
              </TouchableOpacity>

              {showPicker && (
                <>
                  <DateTimePicker
                    mode="datetime"
                    display="spinner"
                    value={params.date}
                    onChange={handleDateChange}
                    onTouchCancel={hideDateTimePicker}
                  />
                  <Button title="Confirm" onPress={hideDateTimePicker} />
                </>
              )}
            </View>
          )}
          {Platform.OS === "android" && (
            <View>
              <TouchableOpacity onPress={showDateTimePicker}>
                <Text
                  style={{
                    color: "#1957E0",
                    fontSize: 20,
                    textAlign: "center",
                    paddingBottom: 10,
                  }}
                >
                  Select Time
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  mode="time"
                  display="clock"
                  value={params.date}
                  onChange={handleDateTimeChange}
                />
              )}
              {showPicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={params.date}
                  onChange={handleTimeChange}
                />
              )}
            </View>
          )}

          <Text style={{ color: "#1957E0", textAlign: "center", margin: 10 }}>
            Transit Routing Preference
          </Text>
          <View>
            <View style={styles.radioButtonContainer}>
              <View style={styles.radioButtonText}>
                <Text>null</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton
                  value="without"
                  status={
                    params.transit_routing_preference === ""
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => params.setTransit_routing_preference("")}
                  color="green"
                />
              </View>
            </View>
            <View style={styles.radioButtonContainer}>
              <View style={styles.radioButtonText}>
                <Text>less_walking</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton
                  value="less_walking"
                  status={
                    params.transit_routing_preference === "less_walking"
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() =>
                    params.setTransit_routing_preference("less_walking")
                  }
                  color="green"
                />
              </View>
            </View>
            <View style={styles.radioButtonContainer}>
              <View style={styles.radioButtonText}>
                <Text>fewer_transfers</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton
                  value="fewer_transfers"
                  status={
                    params.transit_routing_preference === "fewer_transfers"
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() =>
                    params.setTransit_routing_preference("fewer_transfers")
                  }
                  color="green"
                />
              </View>
            </View>
          </View>
          <Text style={{ color: "#1957E0", textAlign: "center", margin: 10 }}>
            Prefer transit mode
          </Text>
          <View style={styles.checkButtonContainer}>
            <Text>bus</Text>
            <View style={styles.radioButton}>
              <Checkbox
                status={params.transit_mode.bus ? "checked" : "unchecked"}
                onPress={() => {
                  params.setTransit_mode((prev) => ({
                    ...prev,
                    bus: !prev.bus,
                  }));
                }}
              />
            </View>
            <Text>subway</Text>
            <View style={styles.radioButton}>
              <Checkbox
                status={params.transit_mode.subway ? "checked" : "unchecked"}
                onPress={() => {
                  params.setTransit_mode((prev) => ({
                    ...prev,
                    subway: !prev.subway,
                  }));
                }}
              />
            </View>
            <Text>train</Text>
            <View style={styles.radioButton}>
              <Checkbox
                status={params.transit_mode.train ? "checked" : "unchecked"}
                onPress={() => {
                  params.setTransit_mode((prev) => ({
                    ...prev,
                    train: !prev.train,
                  }));
                }}
              />
            </View>

            <Text>tram</Text>
            <View style={styles.radioButton}>
              <Checkbox
                status={params.transit_mode.tram ? "checked" : "unchecked"}
                onPress={() => {
                  params.setTransit_mode((prev) => ({
                    ...prev,
                    tram: !prev.tram,
                  }));
                }}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    position: "absolute",
    width: "80%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 15,
  },
  checkButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    justifyContent: "space-around",
  },
  radioButtonText: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 5,
  },
  radioButtonGroup: {
    flexDirection: "row",

    alignItems: "center",
  },
  radioButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    transform: [{ scale: 0.8 }],
  },
});
