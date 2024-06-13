import os
import sys
from pydub import AudioSegment

def extract_utterances(audio_file_path, label_file_path):
    # Load the audio file
    audio = AudioSegment.from_file(audio_file_path)

    # Read the label file
    with open(label_file_path, 'r') as file:
        labels = file.readlines()

    # Base directory for output
    base_output_dir = os.path.splitext(os.path.basename(audio_file_path))[0]

    # Ensure base output directory exists
    if not os.path.exists(base_output_dir):
        os.makedirs(base_output_dir)

    # Process each label
    for label in labels:
        label = label.strip()
        if label:
            parts = label.split('\t')
            start_time = float(parts[0]) * 1000  # convert to milliseconds
            end_time = float(parts[1]) * 1000  # convert to milliseconds
            speaker = parts[2].upper()

            # Extract the audio segment
            utterance = audio[start_time:end_time]

            # Determine the output directory based on the speaker
            speaker_dir = os.path.join(base_output_dir, f"utterances-{speaker.lower()}")

            # Ensure the speaker directory exists
            if not os.path.exists(speaker_dir):
                os.makedirs(speaker_dir)

            # Generate a filename for the utterance
            output_filename = f"{speaker}_output-{parts[0]}.wav"
            output_path = os.path.join(speaker_dir, output_filename)

            # Export the utterance
            utterance.export(output_path, format="wav")
            print(f"Exported: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python pythonfile.py <audiofile> <labelfile>")
        sys.exit(1)

    audio_file_path = sys.argv[1]
    label_file_path = sys.argv[2]

    extract_utterances(audio_file_path, label_file_path)
