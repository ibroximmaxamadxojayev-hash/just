from flask import Flask, send_from_directory, request
import os

app = Flask(__name__)

BASE = os.path.dirname(__file__)
LAST = os.path.join(BASE, "last.html")

@app.route("/")
def home():
    return "HelperBox backend running"

@app.route("/frame.html")
def frame():
    return send_from_directory(BASE, "frame.html")

@app.route("/bridge.js")
def bridge():
    return send_from_directory(BASE, "bridge.js")

@app.route("/save", methods=["POST"])
def save():
    html = request.data.decode("utf-8")
    with open(LAST, "w", encoding="utf-8") as f:
        f.write(html)
    return "ok"

@app.route("/last")
def last():
    if os.path.exists(LAST):
        return send_from_directory(BASE, "last.html")
    return "No snapshot yet"
