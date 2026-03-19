import sounddevice as sd
import numpy as np
from scipy.io.wavfile import write
import subprocess
import requests

samplerate = 44100
channels = 1

API_URL = "http://192.168.137.1:5000/upload"

print("Recording... Press ENTER to stop")

recording = []

def callback(indata, frames, time, status):
    recording.append(indata.copy())

with sd.InputStream(samplerate=samplerate, channels=channels, callback=callback):
    input()

print("Recording stopped")

audio = np.concatenate(recording, axis=0)

wav_file = "recorded_audio.wav"
mp3_file = "recorded_audio.mp3"

write(wav_file, samplerate, audio)

print("Converting to MP3...")

subprocess.run([
    "ffmpeg",
    "-y",
    "-i", wav_file,
    mp3_file
])

print("Sending file to API...")

try:
    with open(mp3_file, "rb") as f:
        files = {"file": f}

        response = requests.post(
            API_URL,
            files=files,
            timeout=10  # ⏱ 10 second timeout
        )

    print("Server response:", response.text)

except requests.exceptions.Timeout:
    print("API request timed out after 10 seconds.")

except requests.exceptions.ConnectionError:
    print("Could not connect to the API server.")

except Exception as e:
    print("Error sending file:", e)
