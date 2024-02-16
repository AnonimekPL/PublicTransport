// import React, { useState, useEffect } from "react";
// import { Text, View } from "react-native";
// import { FlatList } from "react-native";
// import { Button, Card } from "react-native-paper";
// import BusStop from "./BusStop";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { useNavigation } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { RootStackParams } from "../App";

// function Home() {
//   const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
//   const [data, setData] = useState();
//   type item = {
//     id: number;
//     name: string;
//     xPos: number;
//     yPos: number;
//   };

//   useEffect(() => {
//     fetch("http://192.168.1.23:8080/busstop/get", {
//       method: "GET",
//     })
//       .then((resp) => resp.json())
//       .then((bus_stop) => {
//         setData(bus_stop);
//       })
//       .catch((error) => {
//         console.error("Błąd pobierania danych:", error);
//       });
//   }, []);

//   const renderData = (item: item) => {
//     return (
//       <Card style={{ minHeight: 60, margin: 10, justifyContent: "center" }}>
//         <View>
//           <Button
//             onPress={() => navigation.navigate("BusStop", { id: item.id })}
//           >
//             <Text style={{ color: "black", fontSize: 20, textAlign: "center" }}>
//               {item.name}
//             </Text>
//           </Button>
//         </View>
//       </Card>
//     );
//   };

//   return (
//     <View>
//       <Text
//         style={{
//           textAlign: "center",
//           fontSize: 30,
//           color: "darkred",
//           margin: 20,
//         }}
//       >
//         Przystanki
//       </Text>
//       <FlatList
//         style={{ minHeight: "80%" }}
//         data={data}
//         renderItem={({ item }) => {
//           return renderData(item);
//         }}
//         keyExtractor={(item: item) => `${item.id}`}
//       />
//     </View>
//   );
// }

// export default Home;
