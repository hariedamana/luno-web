from flask import Flask, request, jsonify
import os
from datetime import datetime
from transcribe import transcribe_audio
app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

  # tiny, base, small, medium, large

@app.route("/upload", methods=["POST"])
def upload_audio():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    filename = f"audio.mp3"

    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    print("File saved:", filepath)

    # Transcribe audio
    print("Transcribing...")


    transcription = transcribe_audio()
    
    print("Transcription:", transcription)
    return jsonify({
        "status": "success",
        "file_saved": filename,
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)