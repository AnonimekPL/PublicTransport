import { GooglePlaceDetail } from "react-native-google-places-autocomplete";

export type dane = {
  routes: {
    overview_polyline: { points: string };
    legs: {
      arrival_time: object;
      departure_time: object;
      end_location: {
        lat: number;
        lng: number;
      };
      start_location: {
        lat: number;
        lng: number;
      };
      steps: {
        polyline: {
          points: string;
        };
        travel_mode: string;
        transit_details?: {
          arrival_stop: {
            location: {
              lat: number;
              lng: number;
            };
            name: string;
          };
          arrival_time: {
            text: string;
            time_zone: string;
            value: number;
          };
          departure_stop: {
            location: {
              lat: number;
              lng: number;
            };
            name: string;
          };
          departure_time: {
            text: string;
            time_zone: string;
            value: number;
          };
          headsign: string;
          line: {
            agencies: object;
            color: string;
            text_color: string;
            vehicle: object;
            name: string;
            short_name: string;
          };
          num_stop: number;
        };
      }[];
    }[];
  }[];
};

export type markerResult = {
  [choice: number]: {
    [key: string]: Array<[number, number, string, string, string]>;
  };
};

export type InputAutocompleteProps = {
  placeholder: string;
  onPlaceSelected: (details: GooglePlaceDetail | null) => void;
  busStop: string | undefined;
};

export type routes_type = {
  [key: number]: { walking: string[]; transit: string[] };
};

export type RouteItem = {
  key: number;
  value: { walking: string[]; transit: string[] };
};
