import { useEffect, useState } from "react";
import {
  initRecorder,
  startRecording,
  stopRecording,
} from "../recordingFunctions";

function Recorder({ node }) {
  // state
  const [recorder, setRecorder] = useState(null); // For the Tone.js recorder instance
  const [recordedAudioURL, setRecordedAudioURL] = useState(null); // For saving the recorded audio url
  const [isRecording, setIsRecording] = useState(false); //For saving the recording state

  // Initialize effect nodes
  useEffect(() => {
    if (!node) return;
    console.log("Initializing recorder");
    initRecorder(node, setRecorder);

    return () => {
      // dispose recorder
      if (recorder) recorder.dispose();
    };
  }, []);

  return (
    <div className="rounded-md border-solid border-2 border-black w-fit px-2 my-1">
      <button
        onClick={() =>
          isRecording
            ? stopRecording(
                recorder,
                isRecording,
                setIsRecording,
                setRecordedAudioURL
              )
            : startRecording(recorder, isRecording, setIsRecording)
        }
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {recordedAudioURL && ( // checking if recordedAudioURL exists
        <div>
          <p>
            Recording completed.
            <br />
            <a
              href={recordedAudioURL}
              target="_blank"
              rel="noopener noreferrer"
              download="recording.wav"
              className="text-blue-800 italic"
              type="audio/wav"
            >
              {" "}
              Download the result
            </a>
          </p>
          <audio controls src={recordedAudioURL}></audio>
        </div>
      )}
    </div>
  );
}

export default Recorder;
