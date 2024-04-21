from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow import fields
from sqlalchemy import ForeignKey, Column, String, Integer, Time, Float, Text, VARCHAR, Enum as sqlEnum
from sqlalchemy.orm import DeclarativeBase

from datetime import time, date, datetime
from typing import Any, List

from enum import Enum

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import relationship


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost/flask'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)


class Base(DeclarativeBase):
    pass


class WeekdayEnum(Enum):
    WORKING_DAYS = 1
    WEEKENDS_AND_BREAK = 2


class Schedule(db.Model):
    __tablename__ = "schedule"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    bus_stop_id: Mapped[int] = mapped_column(
        "bus_stop_id", ForeignKey("bus_stop.id"))
    arrival: Mapped[time] = mapped_column("arrival", Time)
    bus_line_id: Mapped[int] = mapped_column(
        "bus_line_id", ForeignKey("bus_line.id"))
    weekday: Mapped[WeekdayEnum] = mapped_column(
        'weekday', sqlEnum(WeekdayEnum))
    bus_stop: Mapped["BusStop"] = relationship(back_populates="schedules")
    bus_line: Mapped["BusLine"] = relationship(back_populates="schedules")

    def __init__(self, id, bus_stop_id, arrival, bus_line_id, weekday):
        self.id = id
        self.bus_stop_id = bus_stop_id
        self.arrival = arrival
        self.bus_line_id = bus_line_id
        self.weekday = weekday


class ScheduleSchema(ma.Schema):
    class Meta:
        fields = ('id', 'bus_stop_id', 'arrival', 'bus_line_id', 'weekday')

    weekday = fields.Method("get_weekday_enum_value")

    def get_weekday_enum_value(self, obj):
        return obj.weekday.value


schedule_schema = ScheduleSchema(many=False)
schedules_schema = ScheduleSchema(many=True)


class BusStop(db.Model):
    __tablename__ = "bus_stop"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column("name", VARCHAR(200), nullable=False)
    xPos: Mapped[float] = mapped_column("xPos", Float, nullable=False)
    yPos: Mapped[float] = mapped_column("yPos", Float, nullable=False)
    schedules: Mapped[List["Schedule"]] = relationship(
        back_populates="bus_stop")

    def __init__(self, name, xPos, yPos, id) -> None:
        self.id = id
        self.name = name
        self.xPos = xPos
        self.yPos = yPos


class BusStopSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'xPos', 'yPos')


bus_stop_schema = BusStopSchema()
bus_stops_schema = BusStopSchema(many=True)


class TypeEnum(Enum):
    BUS = 1
    TRAM = 2
    SUBWAY = 3


class BusLine(db.Model):
    __tablename__ = "bus_line"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    line_name: Mapped[str] = mapped_column(
        "line_name", VARCHAR(200), nullable=False)
    driving_sequence: Mapped[str] = mapped_column(
        "driving_sequence", VARCHAR(200))
    driving_sequence_2: Mapped[str] = mapped_column(
        "driving_sequence_2", VARCHAR(200))
    schedules: Mapped[List["Schedule"]] = relationship(
        back_populates="bus_line")
    type: Mapped[TypeEnum] = mapped_column(
        'type', sqlEnum(TypeEnum), nullable=False)

    def __init__(self, line_name, driving_sequence, driving_sequence_2, type) -> None:
        self.line_name = line_name
        self.driving_sequence = driving_sequence
        self.driving_sequence_2 = driving_sequence_2
        self.type = type


class BusLineSchema(ma.Schema):
    class Meta:
        fields = ('id', 'line_name', 'driving_sequence',
                  'driving_sequence_2', 'type')

    type = fields.Method("get_type_enum_value")

    def get_type_enum_value(self, obj):
        return obj.type.value


bus_lines_schema = BusLineSchema(many=True)
bus_line_schema = BusLineSchema()


@app.route('/schedule/get', methods=['GET'])
def get_schedules():
    all_schedules = Schedule.query.all()
    results = schedules_schema.dump(all_schedules)
    return jsonify(results)


@app.route('/busline/get', methods=['GET'])
def get_busline():
    all_schedules = BusLine.query.all()
    results = bus_lines_schema.dump(all_schedules)
    return jsonify(results)


@app.route('/busline/get/<string:type>', methods=['GET'])
def get_busline_by_type(type: str):
    if type.upper() in [member.name for member in TypeEnum.__members__.values()]:
        filtered_bus_lines = BusLine.query.filter_by(
            type=TypeEnum[type.upper()]).all()

        results = bus_lines_schema.dump(filtered_bus_lines)
        return jsonify(results)
    else:
        abort(400, 'Invalid vehicle type')


@app.route('/busstop/get', methods=['GET'])
def get_bus_stops():
    all_bus_stops = BusStop.query.all()
    results = bus_stops_schema.dump(all_bus_stops)
    return jsonify(results)


@app.route('/busstop/get/<int:id>', methods=['GET'])
def get_bus_stop_by_id(id: int):
    bus_stop: BusStop = BusStop.query.get(id)
    if not bus_stop:
        abort(404)

    result = bus_stop_schema.dump(bus_stop)
    return jsonify(result)


@app.route('/busstop/direction/get/<int:id>', methods=['GET'])
def get_directions(id: int):
    bus_line: BusLine = BusLine.query.get(id)
    if not bus_line:
        abort(404)
    seq1 = bus_line.driving_sequence.split("-")[-1]
    seq2 = bus_line.driving_sequence_2.split("-")[-1]
    bus_stop1: BusStop = BusStop.query.get(int(seq1))
    bus_stop2: BusStop = BusStop.query.get(int(seq2))
    return jsonify(id, bus_stop1.name, bus_stop2.name)


@app.route('/busstop/get/<int:id>/<int:direction>', methods=['GET'])
def get_bus_stop(id: int, direction: int):
    bus_line: BusLine = BusLine.query.get(id)
    if not bus_line:
        abort(404)
    if direction == 1:
        sequence = list(map(int, bus_line.driving_sequence.split("-")))
    elif direction == 2:
        sequence = list(map(int, bus_line.driving_sequence_2.split("-")))
    else:
        abort(404)
    bus_stops: List[BusStop] = BusStop.query.filter(
        BusStop.id.in_(sequence)).all()
    bus_stops.sort(key=lambda x: sequence.index(x.id))

    return bus_stops_schema.jsonify(bus_stops)


@app.route('/schedule/get/<int:id>/<string:weekday>', methods=['GET'])
def get_schedule(id: int, weekday: str):
    if not Schedule.query.filter_by(bus_stop_id=id).first():
        abort(404)
    if weekday in [member.name for member in WeekdayEnum.__members__.values()]:
        schedules: List[Schedule] = Schedule.query.filter_by(
            bus_stop_id=id).filter_by(
                weekday=WeekdayEnum[weekday]).all()

        arrivals: List[time] = [x.arrival for x in schedules]
        arrivals.sort(key=lambda x: (x.hour, x.minute))
        dictArrival = {}

        for x in range(24):
            dictArrival[str(x)] = [
                str(times.minute) for times in arrivals if times.hour == x]

        return jsonify(dictArrival)
    abort(400, 'Incorect data')


@app.route('/shortestWay/get/<int:bus_stop_id>/<int:bus_stop_id2>', methods=['GET'])
def get_shortest_Way(bus_stop_id: int, bus_stop_id2: int):
    bus_stops: List[BusStop] = BusStop.query.all()
    current_data = datetime.now().strftime("%H-%M-%")
    print(current_data)
    return bus_stops_schema.jsonify(bus_stops)


with app.app_context():
    db.create_all()
if __name__ == "__main__":
    app.run(host='192.168.1.23', port=8080, debug=True)
