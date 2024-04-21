const WeekdayEnum = {
  WORKING_DAYS: 1,
  WEEKENDS_AND_BREAK: 2,
};

export type schedule = {
  id: number;
  bus_stop_id: number;
  arrival: Date;
  bus_number: number;
  weekday: typeof WeekdayEnum;
};
