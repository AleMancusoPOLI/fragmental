import * as Tone from "tone";
import { applyEnvelope } from "./envelopeLogic";
import { mapEnvelopeToDuration } from "./envelopeLogic";

// Initialize players and connect to destination
export const initializePlayers = async (
  url,
  grainNumber,
  setPlayers,
  setRecorder,
  gain,
  gainNode,
  pitchNode,
  setGainNode,
  setPitchNode,
  onGainNodeReady
) => {
  console.log("Initializing players...", grainNumber);
  // Intermediate function is need to have an async block
  const grainPlayers = await createGrainPlayers(url, grainNumber);
  // let [g, p] = [null, null];
  // if (gainNode && pitchNode) {
  //   [g, p] = [gainNode, pitchNode];
  // } else {
  //   [g, p] = await initNodes(gain, setGainNode, setPitchNode);
  //   onGainNodeReady(g);
  // }
  //console.log("gain and pitch are " + g, p);
  // Creating and connecting the recording instance
  const recorderInstance = new Tone.Recorder();
  grainPlayers.forEach((player) => {
    player.connect(recorderInstance); // Connecting to the recorder
    //player.chain(p, g); // Connecting to the nodes
  });

  //g.connect(recorderInstance); // Connecting to the recorder

  // Set players and recoder
  setPlayers(grainPlayers);
  setRecorder(recorderInstance);

  // logs
  console.log("Players're ready!");
  console.log("Recoder's ready!");
};

// Default envelope based on grain duration
const initializeEnvelope = (grainDuration) => {
  const attack = grainDuration * 0.1; // 10% of the grain duration
  const sustain = grainDuration * 0.6; 
  const release = grainDuration * 0.3;

  return [
    { time: 0, amplitude: 0 },
    { time: attack, amplitude: 1 },
    { time: attack + sustain, amplitude: 1 },
    { time: attack + sustain + release, amplitude: 0 },
  ];
};

// Create players for all grains
export const createGrainPlayers = async (url, grainNumber) => {
  const grainPlayers = [];
  const audioContext = Tone.getContext();

  // Fetch and decode the audio file
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch audio file: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  if (audioBuffer.numberOfChannels === 0) {
    throw new Error("Audio buffer has no channels");
  }

  // Compute the exact interval between every grain
  const grainDuration = audioBuffer.duration / grainNumber;

  // Configure each player for its grain
  for (let i = 0; i < grainNumber; i++) {
    // Start and end positions of the specific grain on the audio buffer
    const start = i * grainDuration;
    const end = Math.min(start + grainDuration, audioBuffer.duration);

    const player = new Tone.Player({
      url,
      loop: false,
      onload: () => {
        // Every grain buffer is the whole buffer sliced from start to end
        player.buffer = player.buffer.slice(start, end);

        //const fadeTime = parseFloat(player.buffer.duration.toFixed(1)) * 0.1;
        //player.fadeIn = fadeTime;
        //player.fadeOut = fadeTime / 2;
      },
    });
    player.envelope = initializeEnvelope(grainDuration); // initialize and store the envelope for the grain
    grainPlayers.push(player); // add player to the array
  }
  return grainPlayers;
};

// const initNodes = async (gain, setGainNode, setPitchNode) => {
//   const g = new Tone.Gain(gain);
//   const p = new Tone.PitchShift();
//   setGainNode(g);
//   setPitchNode(p);
//   return [g, p];
// };

// Play a random grain
export const playGrain = (players, duration, position, range, envelopeADSR) => {
  if (players.length > 0) {
    console.log("playing grain");

    // Ensure indexes are not out of bounds
    const startIndex = Math.max(0, position - range); // 0 or pos-range
    const endIndex = Math.min(players.length, position + range + 1); // max or pos+range

    const playersInRange = players.slice(startIndex, endIndex);

    const randomIndex = Math.floor(Math.random() * playersInRange.length);
    const grain = playersInRange[randomIndex];
    const durationSeconds = duration / 1000;
    const envelope = mapEnvelopeToDuration(envelopeADSR, durationSeconds); // Map envelope
    console.log("this is gain " + grain.gainNode.gain);
    applyEnvelope([grain], envelope);

    grain.start(Tone.now());
    grain.stop(Tone.now() + durationSeconds); // Stop based on updated duration
  }
};

// Start playback at the specified rate
export const startPlayback = (
  players,
  isPlaying,
  setIsPlaying,
  setLoop,
  playGrain,
  rate,
  probability,
  durationRef, // Pass refs instead of functions
  positionRef,
  rangeRef,
  envelope
) => {
  if (!isPlaying) {
    console.log("playback started");
    setIsPlaying(true);

    // Create a loop for playing grains
    const newLoop = new Tone.Loop((time) => {
      // Use the getter functions to fetch updated values
      const duration = durationRef.current;
      const position = positionRef.current;
      const range = rangeRef.current;

      playGrain(players, duration, position, range, envelope);
    }, rate / 1000); // Initial interval based on rate

    newLoop.probability = probability;

    // Store loop instance
    newLoop.start(0);
    setLoop(newLoop);

    Tone.getTransport().start();
  }
};

// Stop playback
export const stopPlayback = (
  isPlaying,
  setIsPlaying,
  loop,
  setLoop,
  players
) => {
  if (isPlaying) {
    console.log("playback stopped");
    setIsPlaying(false);
    if (loop) {
      loop.stop();
    }
    Tone.getTransport().stop();
    setLoop(null);

    // Stop all grains to end sound
    players.forEach((player) => player.stop());
  }
};
