from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

from sqlalchemy import ForeignKey, Column, String, Integer, Time, Float, Text
from sqlalchemy.orm import DeclarativeBase

from datetime import datetime
from typing import Any, List


from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import relationship
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost/flask'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)
# Klasa reprezentująca przystanki autobusowe


# class BusStop(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(255), nullable=False)  # Nazwa przystanku
#     xPos = db.Column(db.Float, nullable=False)  # Współrzędna x
#     yPos = db.Column(db.Float, nullable=False)  # Współrzędna y

#     def __init__(self, name, xPos, yPos):
#         self.name = name
#         self.xPos = xPos
#         self.yPos = yPos

# Klasa reprezentująca linie autobusowe


# class BusLine(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     number = db.Column(db.String(50), nullable=False)  # Numer linii
#     stops = db.relationship(
#         'BusStop', secondary='bus_stop_lines', back_populates='lines')

#     def __init__(self, number):
#         self.number = number


# # Tabela łącznikowa między przystankami a liniami autobusowymi
# bus_stop_lines = db.Table('bus_stop_lines',
#                           db.Column('bus_stop_id', db.Integer, db.ForeignKey(
#                               'bus_stop.id'), primary_key=True),
#                           db.Column('bus_line_id', db.Integer, db.ForeignKey(
#                               'bus_line.id'), primary_key=True)
#                           )

class Base(DeclarativeBase):
    pass


class Schedule(db.Model):
    __tablename__ = "schedule"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    bus_stop_id: Mapped[int] = mapped_column(ForeignKey("bus_stop.id"))
    arrival: Mapped[datetime] = mapped_column()
    bus_number: Mapped[int] = mapped_column(ForeignKey("bus_line.id"))

    bus_stop: Mapped["BusStop"] = relationship(back_populates="schedules")
    bus_line: Mapped["BusLine"] = relationship(back_populates="schedules")

    def __init__(self, id, bus_stop_id, arrival, bus_number):
        self.id = id
        self.bus_stop_id = bus_stop_id
        self.arrival = arrival
        self.bus_number = bus_number

# class Schedule(db.Model):
#     __tablename__ = "schedule"
#     id = Column("id", Integer, primary_key=True)
#     bus_stop_id = Column("bus_stop_id", Integer)
#     arrival = Column("arrival", Time)
#     bus_number = Column("bus_number", Integer)
#     # children: Mapped[List["Child"]] = relationship()

#     def __init__(self, id, bus_stop_id, arrival, bus_number):
#         self.id = id
#         self.bus_stop_id = bus_stop_id
#         self.arrival = arrival
#         self.bus_number = bus_number


class ScheduleSchema(ma.Schema):
    class Meta:
        fields = ('id', 'bus_stop_id', 'arrival', 'bus_number')


class BusStop(db.Model):
    __tablename__ = "bus_stop"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column("name", String(255), nullable=False)
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


class BusLine(db.Model):
    __tablename__ = "bus_line"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    line_name: Mapped[str] = mapped_column("line_name", String(200))
    driving_sequence: Mapped[str] = mapped_column(
        "driving_sequence", String(200))
    schedules: Mapped[List["Schedule"]] = relationship(
        back_populates="bus_line")

    def __init__(self, line_name, driving_sequence) -> None:
        self.line_name = line_name
        self.driving_sequence = driving_sequence


class BusLineSchema(ma.Schema):
    class Meta:
        fields = ('id', 'line_name', 'driving_sequence')

# class Schedule(db.Model):
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     schedule_id = db.Column(
#         db.Integer, db.ForeignKey('bus_stop.id'), nullable=False)
#     arrival = db.Column(db.Time, nullable=False)
#     bus_line_number = db.Column(db.String(10), nullable=False)

#     przystanek = db.relationship('BusStop', backref='rozklad', lazy=True)

#     def __init__(self, schedule_id, arrival, bus_line_number) -> None:
#         self.schedule_id = schedule_id
#         self.arrival = arrival
#         self.bus_line_number = bus_line_number


# class ScheduleSchema(ma.Schema):
#     class Meta:
#         fields = ('id', 'schedule_id', 'arrival', 'bus_line_number')


bus_stop_schema = BusStopSchema()
bus_stop_schemas = BusStopSchema(many=True)

# schedule_schema = ScheduleSchema()
# schedules_schema = ScheduleSchema(many=True)

schedule_schemas = ScheduleSchema(many=True)

bus_line_schemas = BusLineSchema(many=True)


@app.route('/schedule/get', methods=['GET'])
def get_schedule():
    all_schedules = Schedule.query.all()
    results = schedule_schemas.dump(all_schedules)
    return jsonify(results)


@app.route('/busline/get', methods=['GET'])
def get_busline():
    all_schedules = BusLine.query.all()
    results = bus_line_schemas.dump(all_schedules)
    return jsonify(results)


@app.route('/busstop/get', methods=['GET'])
def get_bus_stops():
    all_bus_stops = BusStop.query.all()
    results = bus_stop_schemas.dump(all_bus_stops)
    return jsonify(results)


@app.route('/busstop/get/<int:id>', methods=['GET'])
def get_bus_stop(id):
    schedules = Schedule.query.filter_by(bus_number=id).all()
    bus_stops = set(schedule.bus_stop for schedule in schedules)
    return bus_stop_schemas.jsonify(bus_stops)


# @app.route('/get', methods=['GET'])
# def get_schedule():
#     all_schedules = Schedule.query.all()
#     results = schedules_schema.dump(all_schedules)
#     return jsonify(results)


# @app.route('/add', methods=['POST'])
# def add_schedule():
#     schedule_id = request.json['schedule_id']
#     arrival = request.json['arrival']
#     bus_line_number = request.json['bus_line_number']

#     schedules = Schedule(schedule_id, arrival, bus_line_number)
#     db.session.add(schedules)
#     db.session.commit()
#     return schedule_schema.jsonify(schedules)
# @app.route('/busstop/add', methods=['POST'])
# def add_bus_stop():
#     name = request.json['name']
#     xPos = request.json['xPos']
#     yPos = request.json['yPos']

#     bus_stops = BusStop(name, xPos, yPos)
#     db.session.add(bus_stops)
#     db.session.commit()
#     return schedule_schema.jsonify(bus_stops)


with app.app_context():
    db.create_all()
if __name__ == "__main__":
    app.run(host='192.168.1.23', port=8080, debug=True)
