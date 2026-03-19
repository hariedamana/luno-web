from faster_whisper import WhisperModel
audio_file = "uploads/audio.mp3"
print("Loading model...")

# model options: tiny, base, small, medium, large-v3
model = WhisperModel("base", device="cpu", compute_type="int8")
def transcribe_audio():
    print("Transcribing...")

    segments, info = model.transcribe(audio_file)

    print("Detected language:", info.language)

    transcription = ""

    for segment in segments:
        print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
        transcription += segment.text + " "

 
    return transcription