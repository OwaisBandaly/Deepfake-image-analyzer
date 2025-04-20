from flask import Flask, request, jsonify
from model.predictor import ImageAnalyzer
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://deepfake-image-analyzer.vercel.app"]) 

analyzer = ImageAnalyzer()

@app.route("/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    try:
        result, confidence = analyzer.predict(file)
        return jsonify({
            "result": result,
            "confidence": confidence
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
