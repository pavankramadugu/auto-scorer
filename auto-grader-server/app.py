import shutil
from flask import Flask, request, jsonify
from flask_cors import CORS
import gspread
from google.oauth2.service_account import Credentials
import datetime
from werkzeug.utils import secure_filename
import subprocess
import os

app = Flask(__name__)
CORS(app)

scopes = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

credentials = Credentials.from_service_account_file(
    'creds.json',
    scopes=scopes
)
client = gspread.authorize(credentials)
GO_ENVIRONMENT_PATH = '/Users/pavankramadugu/test'
TEST_FILE_NAME = 'smartcontract_test.go'


@app.route('/save', methods=['POST'])
def save_lab1():
    data = request.json
    sh = client.open("CSE 598 Lab 1").sheet1

    asu_id = data['asuId']
    score = data['score']
    match_info = data['matchInfo']

    cell = sh.find(asu_id)

    if cell:
        current_score = int(sh.cell(cell.row, 2).value)
        if score >= current_score:
            sh.update_cell(cell.row, 2, score)
            sh.update_cell(cell.row, 3, str(match_info))
            sh.update_cell(cell.row, 4, str(datetime.datetime.now()))
    else:
        sh.append_row([asu_id, score, str(match_info), str(datetime.datetime.now())])

    return jsonify({"message": "Data processed successfully"})


@app.route('/upload-file', methods=['POST'])
def upload_go_file():
    username = request.form.get('username')  # Get username from request params
    if not username:
        return jsonify({'message': 'Username is required'}), 400

    if 'smartcontract.go' not in request.files:
        return jsonify({'message': 'Wrong File Name'}), 400

    file = request.files['smartcontract.go']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    user_dir = os.path.join(GO_ENVIRONMENT_PATH, username)
    if not os.path.exists(user_dir):
        os.makedirs(user_dir)

    shutil.copy(os.path.join(GO_ENVIRONMENT_PATH, TEST_FILE_NAME), user_dir)

    filename = secure_filename(file.filename)
    destination_file_path = os.path.join(user_dir, filename)
    file.save(destination_file_path)

    try:
        result = subprocess.run(['go', 'test', '-v'], cwd=user_dir, stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE, text=True)

        shutil.rmtree(user_dir)

        if result.returncode == 0:
            response = {'message': 'Smart Contract tests executed successfully',
                        'results': get_tests_output(result.stdout),
                        'logs': result.stdout}
            save_lab2(username, response)
            return jsonify(response), 200
        else:
            response = {'message': 'Smart Contract tests failed',
                        'results': get_tests_output(result.stdout),
                        'logs': result.stdout}
            save_lab2(username, response)
            return jsonify(response), 200
    except Exception as e:
        shutil.rmtree(user_dir)
        response = {'message': 'Error executing Go tests', 'error': str(e)}
        return jsonify(response), 500


def get_tests_output(output):
    test_output = {}

    lines = output.split('\n')

    for line in lines:
        if '--- PASS:' in line or '--- FAIL:' in line:
            parts = line.split()
            test_name = parts[2]
            outcome = 'PASS' if 'PASS' in parts[1] else 'FAIL'
            test_output[test_name] = outcome

    return test_output


def save_lab2(asu_id, output):
    sh = client.open("CSE 598 Lab 2").sheet1

    cell = sh.find(asu_id)

    score = get_score(output)

    output["score"] = score

    if cell:
        current_score = int(sh.cell(cell.row, 2).value)
        if score >= current_score:
            sh.update_cell(cell.row, 2, score)
            sh.update_cell(cell.row, 3, str(output))
            sh.update_cell(cell.row, 4, str(datetime.datetime.now()))
    else:
        sh.append_row([asu_id, score, str(output), str(datetime.datetime.now())])


def get_score(output):
    score = 0
    for result in output["results"].values():
        if result == "PASS":
            score += 10

    return score


if __name__ == '__main__':
    app.run(debug=True)
