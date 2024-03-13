import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  Polyline,
  Marker,
  LatLng,
  PROVIDER_GOOGLE,
  Callout,
} from "react-native-maps";

import axios from "axios";
import { GOOGLE_API_KEY } from "../environments";
import { Button, Text } from "react-native-paper";
import polyline from "@mapbox/polyline";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import Constants from "expo-constants";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSIOTION = {
  latitude: 52.243517,
  longitude: 21.014086,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};
import { markerResult } from "./types";
import { dane } from "./types";
import InputAutocomplete from "./Map/InputAutocomplete";
import Markers from "./Map/Markers";

export default function Map3() {
  // const pan = useRef(new Animated.ValueXY()).current;

  // const panResponder = useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponder: () => true,
  //     onPanResponderMove: Animated.event(
  //       [
  //         null,
  //         { dx: pan.x, dy: pan.y }, // Opcje dla metody Animated.event
  //       ],
  //       { useNativeDriver: false } // Dodatkowe opcje, tutaj można dostosować
  //     ),
  //     onPanResponderRelease: () => {
  //       pan.extractOffset();
  //     },
  //   })
  // ).current;
  const [markers, setMarkers] = useState<markerResult>();
  const [walkingRoute, setWalkingRoute] = useState<string[]>([]);
  const [transitRoute, setTransitRoute] = useState<string[]>([]);
  const [origin, setOrigin] = useState<LatLng | null>();
  const [destination, setDestination] = useState<LatLng | null>();
  const mapRef = useRef<MapView>(null);
  const addArrayToKey = (
    choice: number,
    key: string,
    arrayToAdd: [number, number, string, string, string]
  ) => {
    setMarkers((prevMarkers) => {
      // Sprawdzamy, czy prevMarkers jest zdefiniowane
      if (prevMarkers !== undefined) {
        // Sprawdzamy, czy istnieje już tablica dla danego klucza
        const existingArray = prevMarkers[choice]?.[key];
        if (existingArray) {
          // Jeśli istnieje, łączymy ją z nową tablicą i zwracamy jako nową tablicę dla klucza
          return {
            ...prevMarkers,
            [choice]: {
              ...prevMarkers[choice],
              [key]: [...existingArray, arrayToAdd],
            },
          };
        } else {
          // Jeśli nie istnieje, tworzymy nową tablicę zawierającą tylko nowy element
          return {
            ...prevMarkers,
            [choice]: { ...prevMarkers[choice], [key]: [arrayToAdd] },
          };
        }
      } else {
        // Jeśli prevMarkers jest niezdefiniowane, możemy zwrócić obiekt z nowym kluczem i tablicą zawierającą nowy element
        return { [choice]: { [key]: [arrayToAdd] } };
      }
    });
  };

  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };
  const onPlaceSelected = (
    details: GooglePlaceDetail | null,
    flag: "origin" | "destination"
  ) => {
    const set = flag === "origin" ? setOrigin : setDestination;
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    };
    set(position);
    moveTo(position);
  };
  const [selectRoute, setSelectRoute] = useState<number>(0);
  // const fetchDirections = async () => {
  //   try {
  //     setTransitRoute([]);
  //     setWalkingRoute([]);
  //     setMarkers(undefined);
  //     const response = await axios.get<dane>(
  //       "https://maps.googleapis.com/maps/api/directions/json",
  //       {
  //         params: {
  //           origin: `${origin?.latitude},${origin?.longitude}`,
  //           destination: `${destination?.latitude},${destination?.longitude}`,
  //           mode: "transit",
  //           // alternatives: true,
  //           key: GOOGLE_API_KEY,
  //         },
  //       }
  //     );

  //     response.data.routes.map((x, index) =>
  //       x.legs.map((y) =>
  //         y.steps.map((z) =>
  //           z.travel_mode === "TRANSIT"
  //             ? setTransitRoute((prev) => [...prev, z.polyline.points])
  //             : setWalkingRoute((prev) => [...prev, z.polyline.points])
  //         )
  //       )
  //     );
  //     response.data.routes.forEach((route) => {
  //       route.legs.forEach((leg) => {
  //         leg.steps.forEach((step) => {
  //           if (step.transit_details) {
  //             const name = step.transit_details.arrival_stop.name;
  //             const name2 = step.transit_details.departure_stop.name;
  //             const location = step.transit_details.arrival_stop.location;
  //             const location2 = step.transit_details.departure_stop.location;
  //             const time = step.transit_details.arrival_time.text;
  //             const time2 = step.transit_details.departure_time.text;
  //             const short_name = step.transit_details.line.short_name;
  //             const long_name = step.transit_details.line.name;
  //             addArrayToKey(name, [
  //               location.lat,
  //               location.lng,
  //               time,
  //               short_name,
  //               long_name,
  //             ]);
  //             addArrayToKey(name2, [
  //               location2.lat,
  //               location2.lng,
  //               time2,
  //               short_name,
  //               long_name,
  //             ]);
  //           }
  //         });
  //       });
  //     });
  //   } catch (error) {
  //     console.error("Error fetching directions:", error);
  //   }
  // };
  const [routes, setRoutes] = useState<{
    [key: number]: { walking: string[]; transit: string[] };
  }>({});

  const fetchDirections = async () => {
    try {
      setRoutes({});
      setMarkers(undefined);

      const response = await axios.get<dane>(
        "https://maps.googleapis.com/maps/api/directions/json",
        {
          params: {
            origin: `${origin?.latitude},${origin?.longitude}`,
            destination: `${destination?.latitude},${destination?.longitude}`,
            mode: "transit",
            alternatives: true,
            key: GOOGLE_API_KEY,
          },
        }
      );
      setSelectRoute(0);
      response.data.routes.forEach((route, index) => {
        const walkingRoute: string[] = [];
        const transitRoute: string[] = [];

        route.legs.forEach((leg) => {
          leg.steps.forEach((step) => {
            if (step.transit_details) {
              transitRoute.push(step.polyline.points);
              const name = step.transit_details.arrival_stop.name;
              const name2 = step.transit_details.departure_stop.name;
              const location = step.transit_details.arrival_stop.location;
              const location2 = step.transit_details.departure_stop.location;
              const time = step.transit_details.arrival_time.text;
              const time2 = step.transit_details.departure_time.text;
              const short_name = step.transit_details.line.short_name;
              const long_name = step.transit_details.line.name;
              addArrayToKey(index, name, [
                location.lat,
                location.lng,
                time,
                short_name,
                long_name,
              ]);
              addArrayToKey(index, name2, [
                location2.lat,
                location2.lng,
                time2,
                short_name,
                long_name,
              ]);
            } else {
              walkingRoute.push(step.polyline.points);
            }
          });
        });

        setRoutes((prevRoutes) => ({
          ...prevRoutes,
          [index]: { walking: walkingRoute, transit: transitRoute },
        }));
      });
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };
  const [selectedMarker, setSelectedMarker] = useState<string>();
  const handleMarkerClick = (markerKey: string) => {
    setSelectedMarker(markerKey);
  };
  // Object.keys(routes).length > 0
  //   ? console.log(routes[0].walking)
  //   : console.log("czekaj");
  const data = Object.entries(routes).map(([key, value]) => ({
    key: parseInt(key),
    value,
  }));

  type RouteItem = {
    key: number;
    value: { walking: string[]; transit: string[] };
  };

  const renderItem = ({ item }: { item: RouteItem }) => (
    <TouchableOpacity onPress={() => setSelectRoute(item.key)}>
      <Text>{item.key}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={INITIAL_POSIOTION}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
      >
        {/* {walkingRoute.length > 0 &&
          walkingRoute.map((x, index) => (
            <Polyline
              key={index} // Upewnij się, że masz unikalny klucz dla każdej polyline
              coordinates={polyline
                .decode(x)
                .map((point) => ({ latitude: point[0], longitude: point[1] }))}
              strokeWidth={4}
              strokeColor="#00f"
              lineDashPattern={[1, 1]}
            />
          ))}
        {transitRoute.length > 0 &&
          transitRoute.map((x, index) => (
            <Polyline
              key={index}
              coordinates={polyline
                .decode(x)
                .map((point) => ({ latitude: point[0], longitude: point[1] }))}
              strokeColor="#f00"
              strokeWidth={4}
            />
          ))} */}

        {Object.keys(routes).length > 0 && (
          <React.Fragment>
            {routes[selectRoute].walking.length > 0 &&
              routes[selectRoute].walking.map((x, index) => (
                <Polyline
                  key={`walking_${index}`}
                  coordinates={polyline.decode(x).map((point) => ({
                    latitude: point[0],
                    longitude: point[1],
                  }))}
                  strokeWidth={4}
                  strokeColor="#00f"
                  lineDashPattern={[1, 1]}
                />
              ))}
            {routes[selectRoute].transit.length > 0 &&
              routes[selectRoute].transit.map((x, index) => (
                <Polyline
                  key={`transit_${index}`}
                  coordinates={polyline.decode(x).map((point) => ({
                    latitude: point[0],
                    longitude: point[1],
                  }))}
                  strokeColor="#f00"
                  strokeWidth={4}
                />
              ))}
            {/* {markers &&
              Object.keys(markers[selectRoute]).map((key) => (
                <Marker
                  key={key}
                  coordinate={{
                    latitude: markers[selectRoute][key][0][0],
                    longitude: markers[selectRoute][key][0][1],
                  }}
                  title={`Przystanek ${key}`}
                  onPress={() => handleMarkerClick(key)}
                />
              ))} */}
            {markers && (
              <Markers
                markers={markers}
                selectRoute={selectRoute}
                handleMarkerClick={handleMarkerClick}
              ></Markers>
            )}
          </React.Fragment>
        )}

        {/* {routes[0].walking.length > 0 &&
          routes[0].walking.map((x, index) => (
            <Polyline
              key={`walking_${index}`}
              coordinates={polyline.decode(x).map((point) => ({
                latitude: point[0],
                longitude: point[1],
              }))}
              strokeWidth={4}
              strokeColor="#00f"
              lineDashPattern={[1, 1]}
            />
          ))} */}
      </MapView>
      {typeof selectedMarker === "string" &&
        typeof selectRoute === "number" &&
        selectedMarker.length > 0 &&
        markers && (
          <View
            style={{
              flex: 1,
              top: "50%",
              position: "absolute",
              backgroundColor: "pink",
            }}
          >
            {markers[selectRoute][selectedMarker].map((m, index) => (
              <View
                key={index}
                style={{
                  display: "flex",
                  alignContent: "center",
                }}
              >
                <Text>{`Przystanek ${selectedMarker}`}</Text>
                <Text>{`Godzina ${m[2]}`}</Text>
                <Text>{`linia ${m[3]}`}</Text>
                <Text>{`nazwa linii ${m[4]}`}</Text>
              </View>
            ))}
            <Button onPress={() => setSelectedMarker("")}>CLOSE</Button>
          </View>
        )}

      <View style={styles.searchContainer}>
        <InputAutocomplete
          label="Origin"
          placeholder=""
          onPlaceSelected={(details) => {
            onPlaceSelected(details, "origin");
          }}
        />
        <InputAutocomplete
          label="Destination"
          placeholder=""
          onPlaceSelected={(details) => {
            onPlaceSelected(details, "destination");
          }}
        />

        <TouchableOpacity onPress={fetchDirections}>
          <Text>Trace Route</Text>
        </TouchableOpacity>

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.key.toString()}
          horizontal={true} // Ustawienie przewijania w poziomie
        />
      </View>
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
});
