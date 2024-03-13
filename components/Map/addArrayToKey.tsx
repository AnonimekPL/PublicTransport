import { markerResult } from "../types";

type props = {
  choice: number;
  key: string;
  arrayToAdd: [number, number, string, string, string];
  setMarkers: React.Dispatch<React.SetStateAction<markerResult | undefined>>;
};

export const addArrayToKey = ({
  choice,
  key,
  arrayToAdd,
  setMarkers,
}: props) => {
  setMarkers((prevMarkers) => {
    if (prevMarkers !== undefined) {
      const existingArray = prevMarkers[choice]?.[key];
      if (existingArray) {
        return {
          ...prevMarkers,
          [choice]: {
            ...prevMarkers[choice],
            [key]: [...existingArray, arrayToAdd],
          },
        };
      } else {
        return {
          ...prevMarkers,
          [choice]: { ...prevMarkers[choice], [key]: [arrayToAdd] },
        };
      }
    } else {
      return { [choice]: { [key]: [arrayToAdd] } };
    }
  });
};
