import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";

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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParams } from "../App";

import { busStop } from "./BusStops/types";
type Props = NativeStackScreenProps<RootStackParams, "Mapa">;
export default function Map4({ route }: Props) {

  const [busStop, setBusStop] = useState<busStop>();
  const [markers, setMarkers] = useState<markerResult>();
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [transit_routing_preference, setTransit_routing_preference] =
    useState<string>("");

  type transit_mode_type = {
    bus: boolean;
    subway: boolean;
    train: boolean;
    tram: boolean;
  };
  const [transit_mode, setTransit_mode] = useState<transit_mode_type>({
    bus: false,
    subway: false,
    train: false,
    tram: false,
  });

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (route.params) {
          const res = await fetch(
            `http://192.168.1.23:8080//busstop/get/${route.params.id}`
          );
          const data = await res.json();
          setBusStop(data);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
      }
    };

    fetchData();
  }, [route.params]);

  useEffect(() => {
    if (busStop) {
      const position = {
        latitude: busStop?.xPos || 0,
        longitude: busStop?.yPos || 0,
      };
      moveTo(position);
      setDestination(position);

    }
  }, [busStop]);

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
      transit_mode,
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



  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={INITIAL_POSIOTION}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
      >
        {routes && <Polylines routes={routes} selectRoute={selectRoute} />}
        {origin && (
          <Marker
            coordinate={{
              latitude: origin?.latitude,
              longitude: origin?.longitude,
            }}
            title={`Przystanek`}
            pinColor="green"
          />
        )}
        {busStop && (
          <Marker
            coordinate={{
              latitude: busStop?.xPos,
              longitude: busStop?.yPos,
            }}
            title={`Przystanek ${busStop.name}`}
            pinColor="green"
          />
        )}
        {origin && (
          <Marker
            coordinate={{
              latitude: origin.latitude,
              longitude: origin.longitude,
            }}
            pinColor="green"
          />
        )}
        {destination && !busStop && (
          <Marker
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            pinColor="green"
          />
        )}
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
        transit_mode={transit_mode}
        setTransit_mode={setTransit_mode}
        busStop={busStop?.name}
      />
      <>
        <ShowAlternativeRoutes
          data={data}
          setSelectRoute={setSelectRoute}
          selectRoute={selectRoute}
          handleMarkerClick={handleMarkerClick}
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
