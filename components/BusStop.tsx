// import React, { useState, useEffect } from "react";
// import { Text, View } from "react-native";
// import { Card } from "react-native-paper";
// import { RootStackParams } from "../App";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";

// type Props = NativeStackScreenProps<RootStackParams, "BusStop">;

// const BusStop = ({ route }: Props) => {
//   const [data, setData] = useState<item | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   type shedules = {
//     arrival: string;
//     bus_line_number: string;
//   };
//   type item = {
//     bus_stop_name: string;
//     schedules: shedules[];
//   };
//   useEffect(() => {
//     // Wykonaj żądanie Fetch na podstawie przekazanego ID
//     fetch(`http://192.168.1.23:8080/busstop/schedule/${route.params.id}`, {
//       method: "GET",
//     })
//       .then((resp) => resp.json())
//       .then((bus_stop) => {
//         setData(bus_stop);
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.error("Błąd pobierania danych:", error);
//         setIsLoading(false);
//       });
//   }, [route]);
//   console.log(data);
//   if (isLoading) {
//     return <Text>Ładowanie...</Text>;
//   }

//   return (
//     <View>
//       {data ? (
//         <Card>
//           <Text>{data.bus_stop_name}</Text>
//           {data.schedules.map((schedule, index) => (
//             <View key={index}>
//               <Text>Arrival Time: {schedule.arrival}</Text>
//               <Text>Bus Line Number: {schedule.bus_line_number}</Text>
//             </View>
//           ))}
//         </Card>
//       ) : (
//         <Text>Brak danych dla ID: {route.params.id}</Text>
//       )}
//     </View>
//   );
// };

// export default BusStop;
