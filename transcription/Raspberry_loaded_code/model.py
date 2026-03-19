import sounddevice as sd
import numpy as np
from scipy.io.wavfile import write
import subprocess
from faster_whisper import WhisperModel

samplerate = 44100
channels = 1

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

print("Loading Faster Whisper model...")

model = WhisperModel(
    "tiny",        # best for Raspberry Pi
    device="cpu",
    compute_type="int8"
)

print("Transcribing...")

segments, info = model.transcribe(mp3_file)

print("Detected language:", info.language)

transcription = ""

for segment in segments:
    print(segment.text)
    transcription += segment.text + " "

print("\nFinal Transcription:")
print(transcription)