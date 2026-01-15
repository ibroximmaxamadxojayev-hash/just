from flask import Flask, send_from_directory
import os

app = Flask(__name__)
HERE = os.path.dirname(__file__)

@app.route("/")
def home():
    return "HelperBox backend running"

@app.route("/frame.html")
def frame():
    return send_from_directory(HERE, "frame.html")

@app.route("/bridge.js")
def bridge():
    return send_from_directory(HERE, "bridge.js")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
