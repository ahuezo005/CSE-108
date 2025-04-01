from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__, static_folder="static")

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance', 'grades.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)
    grade = db.Column(db.Float)

    def __repr__(self):
        return f"<Grade {self.name} {self.grade}>"

#create db table if isn't one
with app.app_context():
    db.create_all()

@app.route("/")
def index():
    return send_from_directory("static", "gradingWebApp.html")
@app.route('/<path:path>')
def send_js(path):
    return send_from_directory('static', path)

@app.route('/grades', methods=['GET'])
def get_all_grades():
    grades = Grade.query.all()
    grades_all = {grade.name: grade.grade for grade in grades }
    return jsonify(grades_all)
@app.route('/grades/<name>', methods=['GET'])
def get_grade(name):
    gradeFile = Grade.query.filter_by(name=name).first()
    if gradeFile:
        return jsonify({gradeFile.name : gradeFile.grade})
    else:
        return jsonify({"message": "Grade not found :("}), 404
@app.route('/grades', methods=['POST'])
def add_grade():
    data = request.get_json()

    if not data or "name" not in data or "grade" not in data:
        return jsonify({"message": "Missing Grade or Name"}), 400

    name = data["name"]
    grade = data["grade"]

    try:
        grade = float(grade)

    except ValueError:
        return jsonify({"message": "Invalid format for grade"}), 400


    exists = Grade.query.filter_by(name=name).first()
    if exists:
        return jsonify({"message": f"Student {name} already exists"}), 400
    gradeFile = Grade(name=name, grade=grade)
    db.session.add(gradeFile)
    db.session.commit()

    return jsonify({"message": f"Student {name} added successfully"}), 201
@app.route('/grades/<name>', methods=['PUT'])
def update_grade(name):
    gradeFile = Grade.query.filter_by(name=name).first()
    if not gradeFile:
        return jsonify({"message": f"Student {name} not found"}), 404

    data = request.get_json()
    if not data or "grade" not in data:
        return jsonify({"message": "Missing Grade or Name"}), 400

    grade = data["grade"]
    try:
        grade = float(grade)
    except:
        return jsonify({"message": "Invalid format for grade"}), 400

    gradeFile.grade = grade
    db.session.commit()

    return jsonify({"message": f"Grade for student {name} updated successfully"})
@app.route('/grades/<name>', methods=['DELETE'])
def delete_grade(name):
    gradeFile = Grade.query.filter_by(name=name).first()

    if not gradeFile:
        return jsonify({"message": f"Student {name} not found"}), 404

    db.session.delete(gradeFile)
    db.session.commit()

    return jsonify({"message": f"Student {name} deleted successfully"})


if __name__ == "__main__":
    app.run(debug=True)