import * as Tone from "tone";

// Start the recording 
export const startRecording = async (recorder, isRecording, setIsRecording) => {
  if (recorder && !isRecording) {
    await Tone.start();
    recorder.start();
    setIsRecording(true);
    console.log("Recording started...");
  }
};

// Stop the recording and save the url of the recording
export const stopRecording = async (recorder, isRecording, setIsRecording, setRecordedAudioURL) => {
  if (recorder && isRecording) {
    const recording = await recorder.stop();
    const audioBlob = new Blob([recording], { type: "audio/wav" });
    const audioURL = URL.createObjectURL(audioBlob);
    setRecordedAudioURL(audioURL);
    setIsRecording(false);
    console.log("Recording stopped. Audio available at:", audioURL);
  }
};