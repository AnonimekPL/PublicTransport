from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
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


class BusStop(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    xPos = db.Column(db.Float, nullable=False)
    yPos = db.Column(db.Float, nullable=False)

    def __init__(self, name, xPos, yPos) -> None:
        self.name = name
        self.xPos = xPos
        self.yPos = yPos


class BusStopSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'xPos', 'yPos')


class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    schedule_id = db.Column(
        db.Integer, db.ForeignKey('bus_stop.id'), nullable=False)
    arrival = db.Column(db.Time, nullable=False)
    bus_line_number = db.Column(db.String(10), nullable=False)

    przystanek = db.relationship('BusStop', backref='rozklad', lazy=True)

    def __init__(self, schedule_id, arrival, bus_line_number) -> None:
        self.schedule_id = schedule_id
        self.arrival = arrival
        self.bus_line_number = bus_line_number


class ScheduleSchema(ma.Schema):
    class Meta:
        fields = ('id', 'schedule_id', 'arrival', 'bus_line_number')


bus_stop_schema = BusStopSchema()
bus_stop_schemas = BusStopSchema(many=True)

schedule_schema = ScheduleSchema()
schedules_schema = ScheduleSchema(many=True)


@app.route('/get', methods=['GET'])
def get_schedule():
    all_schedules = Schedule.query.all()
    results = schedules_schema.dump(all_schedules)
    return jsonify(results)


@app.route('/add', methods=['POST'])
def add_schedule():
    schedule_id = request.json['schedule_id']
    arrival = request.json['arrival']
    bus_line_number = request.json['bus_line_number']

    schedules = Schedule(schedule_id, arrival, bus_line_number)
    db.session.add(schedules)
    db.session.commit()
    return schedule_schema.jsonify(schedules)


@app.route('/busstop/get', methods=['GET'])
def get_bus_stops():
    all_bus_stops = BusStop.query.all()
    results = bus_stop_schemas.dump(all_bus_stops)
    return jsonify(results)


@app.route('/busstop/get/<id>', methods=['GET'])
def get_bus_stop(id):
    bus_stop = BusStop.query.get(id)
    return bus_stop_schema.jsonify(bus_stop)


@app.route('/busstop/add', methods=['POST'])
def add_bus_stop():
    name = request.json['name']
    xPos = request.json['xPos']
    yPos = request.json['yPos']

    bus_stops = BusStop(name, xPos, yPos)
    db.session.add(bus_stops)
    db.session.commit()
    return schedule_schema.jsonify(bus_stops)


with app.app_context():
    db.create_all()
if __name__ == "__main__":
    app.run(host='192.168.1.23', port=8080, debug=True)
