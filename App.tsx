import React, { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import Home from "./components/Home";
interface YourComponentProps {}

const YourComponent: React.FC<YourComponentProps> = () => {
  // const [searchTerm, setSearchTerm] = useState<string>("");
  // const [filteredData, setFilteredData] = useState<string[]>([]);

  // // Dane do filtrowania (przykład)
  // const data: string[] = [
  //   "Orkana Szkoła",
  //   "2 Aleja",
  //   "Estakada",
  //   "Okrzei",
  //   "3 Krzyży",
  // ];

  // // Funkcja filtrująca wyniki na podstawie wprowadzonego tekstu
  // const filterResults = (text: string) => {
  //   const searchTermLowerCase = text.toLowerCase();
  //   const filteredResults = data.filter((item) =>
  //     item.toLowerCase().includes(searchTermLowerCase)
  //   );
  //   setFilteredData(filteredResults);
  //   setSearchTerm(text);
  // };

  return (
    // <>
    //   <View style={styles.container}>
    //     <TextInput
    //       style={styles.text}
    //       placeholder="Search"
    //       onChangeText={(text) => filterResults(text)}
    //       value={searchTerm}
    //     />
    //     <FlatList
    //       data={filteredData}
    //       renderItem={({ item }) => (
    //         <Text
    //           style={styles.item}
    //           onPress={() => {
    //             setSearchTerm(item); // Ustaw wybrany wynik w polu wyszukiwania
    //             setFilteredData([]); // Czyszczenie wyników po wyborze
    //           }}
    //         >
    //           {item}
    //         </Text>
    //       )}
    //       keyExtractor={(item, index) => index.toString()}
    //     />
    //   </View>
    // </>
    <View style={styles.container}>
      <Home />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  // container: {
  //   flex: 1,
  //   //flexDirection: "row",
  //   top: "10%",
  //   justifyContent: "center", // Wyśrodkowanie w pionie
  //   alignItems: "center", // Wyśrodkowanie w poziomie
  //   height: "100%", // Ustawienie wysokości na pełny ekran
  // },
  // item: {
  //   padding: 10,
  //   borderWidth: 1,
  //   borderColor: "black",
  //   minWidth: "30%",
  // },
  // text: {
  //   minHeight: "5%",
  //   minWidth: "30%",
  //   borderWidth: 1,
  //   borderColor: "black",
  // },
});

export default YourComponent;
