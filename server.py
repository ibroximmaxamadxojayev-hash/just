from flask import Flask, send_from_directory, request, Response
import os

app = Flask(__name__)

BASE = os.path.dirname(os.path.abspath(__file__))
LAST = os.path.join(BASE, "last.html")

# ---------------------------
# Health check / root
# ---------------------------
@app.route("/")
def home():
    return Response("HelperBox backend running", mimetype="text/plain")

# ---------------------------
# Frame UI
# ---------------------------
@app.route("/frame.html")
def frame():
    return send_from_directory(BASE, "frame.html")

# ---------------------------
# Bridge script
# ---------------------------
@app.route("/bridge.js")
def bridge():
    resp = send_from_directory(BASE, "bridge.js")
    # allow iframe + cross-origin loading
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Cache-Control"] = "no-store"
    return resp

# ---------------------------
# Save snapshot from host
# ---------------------------
@app.route("/save", methods=["POST"])
def save():
    html = request.data.decode("utf-8", errors="ignore")

    with open(LAST, "w", encoding="utf-8") as f:
        f.write(html)

    return "ok"

# ---------------------------
# Get last snapshot
# ---------------------------
@app.route("/last")
def last():
    if os.path.exists(LAST):
        return send_from_directory(BASE, "last.html")
    return Response("No snapshot yet", mimetype="text/plain")
