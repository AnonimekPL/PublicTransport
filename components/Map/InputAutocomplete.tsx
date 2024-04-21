import { StyleSheet, Text } from "react-native";
import { InputAutocompleteProps } from "../types";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "../../environments";
import { useEffect, useRef } from "react";

export default function InputAutocomplete({
  placeholder,
  onPlaceSelected,
  busStop,
}: InputAutocompleteProps) {
  const addressInputRef = useRef<any>(null);
  useEffect(() => {
    if (typeof busStop === "string") {
      addressInputRef.current.setAddressText(busStop);
    }
  }, [busStop]);

  return (
    <>
      <GooglePlacesAutocomplete
        ref={addressInputRef}
        styles={{ textInput: styles.input }}
        placeholder={placeholder || ""}
        fetchDetails
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          onPlaceSelected(details);
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: "pl",
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: "#888",
    borderWidth: 1,
  },
});
