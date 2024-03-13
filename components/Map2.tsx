import React, { useEffect, useState } from "react";
import { View } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import axios from "axios";
import { GOOGLE_API_KEY } from "../environments";
const Map2: React.FC = () => {
  const [route, setRoute] = useState<string[]>([]);
  const [transitStops, setTransitStops] = useState<
    { latitude: number; longitude: number; name: string }[]
  >([]);

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const response = await axios.get<{
          routes: {
            overview_polyline: { points: string };
            legs: {
              steps: {
                transit_details?: {
                  arrival_stop: {
                    name: string;
                    location: { lat: number; lng: number };
                  };
                };
              };
            }[];
          }[];
        }>("https://maps.googleapis.com/maps/api/directions/json", {
          params: {
            origin: "Złote Tarasy",
            destination: "Galeria Mokotów",
            mode: "transit",
            key: GOOGLE_API_KEY,
          },
        });
        console.log("Response:", response.data.routes);
        if (response.data.routes.length > 0) {
          const points = response.data.routes[0].overview_polyline.points
            .split("\\")
            .join("");
          console.log("Points:", points);
          setRoute([points]);

          const transitStops: {
            latitude: number;
            longitude: number;
            name: string;
          }[] = [];
          response.data.routes[0].legs.forEach((leg: any) => {
            // Używamy 'any' jako tymczasowego typu dla 'leg'
            leg.steps.forEach((step: any) => {
              // Używamy 'any' jako tymczasowego typu dla 'step'
              if (step.transit_details && step.transit_details.arrival_stop) {
                const { name, location } = step.transit_details.arrival_stop;
                transitStops.push({
                  latitude: location.lat,
                  longitude: location.lng,
                  name,
                });
              }
            });
          });
          // console.log("Transit Stops:", transitStops);
          setTransitStops(transitStops);
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };

    fetchDirections();
  }, []);

  // console.log("Route:", route);
  // console.log("Transit Stops:", transitStops);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 52.1784842,
          longitude: 21.0025994,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {route.length > 0 && (
          <Polyline
            coordinates={decodePolyline(route)}
            strokeWidth={4}
            strokeColor="#00f"
          />
        )}

        {transitStops.map((stop, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
            title={`Stop: ${stop.name}`}
          />
        ))}
      </MapView>
    </View>
  );
};

const decodePolyline = (
  encoded: string[]
): { latitude: number; longitude: number }[] => {
  let poly: { latitude: number; longitude: number }[] = [];
  encoded.forEach((encodedString: string) => {
    let index = 0;
    let len = encodedString.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encodedString.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encodedString.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      let p = {
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      };
      poly.push(p);
    }
  });

  return poly;
};

export default Map2;
