from flask import Flask, request, jsonify
from flask_cors import CORS
import gspread
from google.oauth2.service_account import Credentials
import datetime

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


@app.route('/save', methods=['POST'])
def save_to_sheet():
    data = request.json
    sh = client.open("CSE 598 Lab 1").sheet1

    asu_id = data['asuId']
    score = data['score']
    match_info = data['matchInfo']

    cell = sh.find(asu_id)

    if cell:
        current_score = int(sh.cell(cell.row, 2).value)
        if score > current_score:
            sh.update_cell(cell.row, 2, score)
            sh.update_cell(cell.row, 3, str(match_info))
            sh.update_cell(cell.row, 4, str(datetime.datetime.now()))
    else:
        sh.append_row([asu_id, score, str(match_info), str(datetime.datetime.now())])

    return jsonify({"message": "Data processed successfully"})


if __name__ == '__main__':
    app.run(debug=True)
