from flask import Flask, request, jsonify, send_from_directory
import json
import os

# "searches for html,css,js in this folder"
app = Flask(__name__, static_folder="static")

#json file to write to
grades_file = "grades.json"


def initialize_grades():
    if not os.path.exists(grades_file):
        with open(grades_file, "w") as f:
            json.dump({}, f)

def get_grades():
    with open(grades_file, "r") as f:
        return json.load(f)

def save_grades(data):
    with open(grades_file, "w") as f:
        json.dump(data, f)

initialize_grades()

# home inital page -- get files from static to display
@app.route("/")
def index():
    return send_from_directory("static", "gradingWebApp.html")

@app.route('/<path:path>')
def send_js(path):
    return send_from_directory('static', path)

# methods
@app.route('/grades', methods=['GET'])
def get_all_grades():
    grades = get_grades()
    return jsonify(grades)


@app.route('/grades/<name>', methods=['GET'])
def get_grade(name):
    grades = get_grades()
    if name in grades:
        return jsonify({name: grades[name]})

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

    except:
        return jsonify({"message": "Invalid format for grade"}), 400

    grades = get_grades()

    if name in grades:
        return jsonify({"message": f"Student {name} already exists"}), 400

    grades[name] = grade
    save_grades(grades)

    return jsonify({"message": f"Student {name} added successfully"}), 201


@app.route('/grades/<name>', methods=['PUT'])
def update_grade(name):
    data = request.get_json()

    if not data or "grade" not in data:
        return jsonify({"message": "Missing Grade or Name"}), 400

    grade = data["grade"]

    try:
        grade = float(grade)
    except:
        return jsonify({"message": "Invalid format for grade"}), 400

    grades = get_grades()

    if name not in grades:
        return jsonify({"message": f"Student {name} not found"}), 404

    grades[name] = grade
    save_grades(grades)

    return jsonify({"message": f"Grade for student {name} updated successfully"})


@app.route('/grades/<name>', methods=['DELETE'])
def delete_grade(name):
    grades = get_grades()

    if name not in grades:
        return jsonify({"message": f"Student {name} not found"}), 404

    del grades[name]
    save_grades(grades)

    return jsonify({"message": f"Student {name} deleted successfully"})


if __name__ == "__main__":
    app.run(debug=True)
