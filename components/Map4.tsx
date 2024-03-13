import React, { useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import MapView, { LatLng, PROVIDER_GOOGLE } from "react-native-maps";

import ShowAlternativeRoutes from "./Map/ShowAlternativeRoutes";
import axios from "axios";
import { GOOGLE_API_KEY } from "../environments";
import { Button, Text } from "react-native-paper";
import { fetchDirections } from "./Map/fetchDirections";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import Constants from "expo-constants";
import MarkerInfo from "./Map/MarkerInfo";
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
import { markerResult, routes_type, dane } from "./types";
import Markers from "./Map/Markers";
import SearchContainer from "./Map/SearchContainer";
import Polylines from "./Map/Polylines";
import { RouteItem } from "./types";
// import { addArrayToKey } from "./Map/addArrayToKey";
export default function Map4() {
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
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [transit_routing_preference, setTransit_routing_preference] =
    useState<string>("");

  const mapRef = useRef<MapView>(null);

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

  const [routes, setRoutes] = useState<routes_type>({});
  const handleFetchDirections = async () => {
    await fetchDirections({
      origin,
      destination,
      routes,
      setRoutes,
      setMarkers,
      setSelectRoute,
      date,
      transit_routing_preference,
    });
  };

  const [selectedMarker, setSelectedMarker] = useState<string>();
  const handleMarkerClick = (markerKey: string) => {
    setSelectedMarker(markerKey);
  };

  const data = Object.entries(routes).map(([key, value]) => ({
    key: parseInt(key),
    value,
  }));

  const renderItem = ({ item }: { item: RouteItem }) => (
    <Button
      onPress={() => setSelectRoute(item.key)}
      style={{
        display: "flex",
        justifyContent: "space-around",
        shadowOpacity: 0.4,
        backgroundColor: item.key === selectRoute ? "grey" : "white",
      }}
    >
      <Text>{item.key + 1}</Text>
    </Button>
  );
  console.log(markers);
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={INITIAL_POSIOTION}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
      >
        {routes && <Polylines routes={routes} selectRoute={selectRoute} />}

        {markers && typeof markers[selectRoute] !== "undefined" && (
          <Markers
            markers={markers}
            selectRoute={selectRoute}
            handleMarkerClick={handleMarkerClick}
          ></Markers>
        )}
      </MapView>
      {typeof selectedMarker === "string" &&
        typeof selectRoute === "number" &&
        selectedMarker.length > 0 &&
        markers && (
          <MarkerInfo
            markers={markers}
            selectRoute={selectRoute}
            selectedMarker={selectedMarker}
            handleMarkerClick={handleMarkerClick}
          ></MarkerInfo>
        )}

      <SearchContainer
        onPlaceSelected={onPlaceSelected}
        fetchDirections={handleFetchDirections}
        setDate={setDate}
        date={date}
        transit_routing_preference={transit_routing_preference}
        setTransit_routing_preference={setTransit_routing_preference}
      />
      <>
        <ShowAlternativeRoutes
          data={data}
          setSelectRoute={setSelectRoute}
          selectRoute={selectRoute}
        />
      </>
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
