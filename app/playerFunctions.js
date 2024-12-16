import * as Tone from "tone";

// Initialize players and connect to destination
export const initializePlayers = async (url, grainNumber, setPlayers, setRecorder, gain, setGainNode, setPitchNode) => {
  console.log("Initializing players...", grainNumber);
  // Intermediate function is need to have an async block
  const grainPlayers = await createGrainPlayers(url, grainNumber);
  const [g, p] = await initNodes(gain, setGainNode, setPitchNode);
  // Creating and connecting the recording instance
  const recorderInstance = new Tone.Recorder();
  grainPlayers.forEach(
    (player) => {
      player.connect(recorderInstance); // Connecting to the recorder
      player.chain(p, g); // Connecting to the nodes
    });
  // Set players and recoder
  setPlayers(grainPlayers);
  setRecorder(recorderInstance);

  // logs 
  console.log("Players're ready!");
  console.log("Recoder's ready!");
};

// Create players for all grains
export const createGrainPlayers = async (url, grainNumber) => {
  const grainPlayers = [];
  const audioContext = Tone.getContext();

  // Fetch and decode the audio file
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Compute the exact interval between every grain
  const grainDuration = audioBuffer.duration / grainNumber;

  // Configure each player for its grain
  for (let i = 0; i < grainNumber; i++) {
    // Start and end positions of the specific grain on the audio buffer
    const start = i * grainDuration;
    const end = start + grainDuration;

    const player = new Tone.Player({
      url,
      loop: false,
      onload: () => {
        // Every grain buffer is the whole buffer sliced from start to end
        player.buffer = player.buffer.slice(start, end);
      },
    });
    grainPlayers.push(player); // add player to the array
  }
  return grainPlayers;
};

const initNodes = async (gain, setGainNode, setPitchNode) => {
  const g = new Tone.Gain(gain).toDestination();
  const p = new Tone.PitchShift();
  setGainNode(g);
  setPitchNode(p);
  return [g, p];
};

// Play a random grain
export const playGrain = (players, duration, position, range) => {
  if (players.length > 0) {
    console.log("playing grain")

    // Ensure indexes are not out of bounds
    const startIndex = Math.max(0, position - range); // 0 or pos-range
    const endIndex = Math.min(players.length, position + range + 1); // max or pos+range

    const playersInRange = players.slice(startIndex, endIndex);

    const randomIndex = Math.floor(Math.random() * playersInRange.length);
    const grain = playersInRange[randomIndex];

    grain.start(Tone.now());
    grain.stop(Tone.now() + duration / 1000); // Stop based on updated duration
  }
};

// Start playback at the specified rate
export const startPlayback = (players, isPlaying, setIsPlaying, setLoop, playGrain, rate, probability, duration, position, range) => {
  if (!isPlaying) {
    console.log("playback started");
    setIsPlaying(true);
    // Create a loop for playing grains
    const newLoop = new Tone.Loop((time) => {
      playGrain(players, duration, position, range);
    }, rate / 1000); // Initial interval based on rate
    newLoop.probability = probability;
    // Store loop instance
    newLoop.start(0);
    setLoop(newLoop);

    Tone.getTransport().start();
  }
};

// Stop playback
export const stopPlayback = (isPlaying, setIsPlaying, loop, setLoop, players) => {
  if (isPlaying) {
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