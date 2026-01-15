from flask import Flask, request, send_from_directory, Response
import os

app = Flask(__name__)
HERE = os.path.dirname(__file__)
LAST = os.path.join(HERE, "last.html")

@app.route("/")
def home():
    return "HelperBox backend running"

@app.route("/frame.html")
def frame():
    return send_from_directory(HERE, "frame.html")

@app.route("/bridge.js")
def bridge():
    return send_from_directory(HERE, "bridge.js")

@app.route("/save", methods=["POST"])
def save():
    html = request.data.decode("utf-8")
    with open(LAST, "w", encoding="utf-8") as f:
        f.write(html)
    return "ok"

@app.route("/last")
def last():
    if os.path.exists(LAST):
        return send_from_directory(HERE, "last.html")
    return "No snapshot yet"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
