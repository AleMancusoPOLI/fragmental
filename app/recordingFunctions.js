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
    console.log("Recording data type:", recording.type); // Expect: "audio/ogg; codecs=opus"

    // Create a Blob for the OGG file (by default Tone.Recorder records audio in the ogg format)
    const audioBlob = new Blob([recording], { type: "audio/ogg" });
    console.log("Audio Blob MIME type:", audioBlob.type);

    // Decode OGG to AudioBuffer
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    console.log("Decoded AudioBuffer:", audioBuffer);
    console.log("Number of Channels:", audioBuffer.numberOfChannels);

    // Re-encode AudioBuffer to wav
    const wavBlob = encodeWAV(audioBuffer);
    const wavURL = URL.createObjectURL(wavBlob);
    setRecordedAudioURL(wavURL); // Set wav url
    setIsRecording(false);
  }
};


function encodeWAV(audioBuffer) {
  console.log('audio beffer is ' + audioBuffer);
  console.log('numb of channels is' + audioBuffer.numberOfChannels);

  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM format
  const bitDepth = 16;

  // Combine all channel data
  const channels = [];
  let length = 0;
  for (let i = 0; i < numberOfChannels; i++) {
    const channelData = audioBuffer.getChannelData(i);
    channels.push(channelData);
    length += channelData.length;
  }

  console.log(channels);

  // Interleave channels
  const interleaved = new Float32Array(length);
  let inputIndex = 0;
  for (let i = 0; i < channels[0].length; i++) {
    for (let j = 0; j < numberOfChannels; j++) {
      interleaved[inputIndex++] = channels[j][i];
    }
  }

  // Convert to PCM
  const buffer = new ArrayBuffer(44 + interleaved.length * 2); // WAV header + data
  const view = new DataView(buffer);

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + interleaved.length * 2, true); // Chunk size
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, format, true); // Audio format (1 for PCM)
  view.setUint16(22, numberOfChannels, true); // Number of channels
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, sampleRate * numberOfChannels * 2, true); // Byte rate
  view.setUint16(32, numberOfChannels * 2, true); // Block align
  view.setUint16(34, bitDepth, true); // Bits per sample
  writeString(view, 36, 'data');
  view.setUint32(40, interleaved.length * 2, true); // Subchunk2Size

  // Write interleaved PCM samples
  const offset = 44;
  for (let i = 0; i < interleaved.length; i++) {
    const sample = Math.max(-1, Math.min(1, interleaved[i])); // Clamp value
    view.setInt16(offset + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
