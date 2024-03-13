import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import InputAutocomplete from "./InputAutocomplete";
import Constants from "expo-constants";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { useState } from "react";
import { RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "react-native";
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
};
export default function SearchContainer(params: prop) {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  // const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const showDateTimePicker = () => {
    setShowPicker(true);
  };

  const hideDateTimePicker = () => {
    setShowPicker(false);
  };

  const handleDateChange = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || params.date;
    params.setDate(currentDate);
  };
  const handleConfirmDate = () => {
    hideDateTimePicker(); // Ukryj DateTimePicker po naciśnięciu przycisku "Confirm"
    // Tutaj możesz wykonać dodatkowe operacje po potwierdzeniu daty
  };
  return (
    <View style={styles.searchContainer}>
      <InputAutocomplete
        label="Origin"
        placeholder=""
        onPlaceSelected={(details) => {
          params.onPlaceSelected(details, "origin");
        }}
      />
      <InputAutocomplete
        label="Destination"
        placeholder=""
        onPlaceSelected={(details) => {
          params.onPlaceSelected(details, "destination");
        }}
      />

      <TouchableOpacity onPress={params.fetchDirections}>
        <Text>Trace Route</Text>
      </TouchableOpacity>
      <Button title="filtry" onPress={() => setShowFilters((prev) => !prev)} />

      {showFilters && (
        <View>
          <View>
            <Button title="Open Date Picker" onPress={showDateTimePicker} />
            {showPicker && (
              <>
                <DateTimePicker
                  mode="datetime"
                  display="spinner"
                  value={params.date}
                  onChange={handleDateChange}
                  onTouchCancel={handleConfirmDate}
                />
                <Button title="Confirm" onPress={handleConfirmDate} />
              </>
            )}
          </View>
          <Text>Transit Routing Preference:</Text>
          <View style={styles.radioButtonContainer}>
            <View style={styles.radioButtonText}>
              <Text>brak</Text>
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
              <Text>mniej chodzenia</Text>
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
              <Text>mniej przesiadek</Text>
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
  },
  radioButtonText: {
    flex: 1,
    flexDirection: "column",
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
