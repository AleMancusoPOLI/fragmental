import React, { useState, useEffect, useCallback } from "react";
import * as Tone from "tone";

function Player({ fileUrl, wavesurferInstance }) {
  // the first argument is the current state, the second - function to update the argument
  // useState(arg), arg is the initial state

  const [isPlaying, setIsPlaying] = useState(false); // Boolean for the play/pause button
  const [players, setPlayers] = useState([]); // Array of players, one for each grain
  const [position, setPosition] = useState(0); // Start position
  const [grains, setGrains] = useState(10); // Number of grains
  const [rate, setRate] = useState(500); // Rate in milliseconds
  const [duration, setDuration] = useState(500); // Duration in milliseconds
  const [loop, setLoop] = useState(null); // To control the loop
  const [probability, setProbability] = useState(1); // The probability of playing a grain

  //initializePlayers is invoked only after the user stops making changes for at least 500ms
  var debounce = require("lodash/debounce");

  const debouncedInitializePlayers = useCallback(
    debounce((url, grainNumber) => {
      initializePlayers(url, grainNumber);
    }, 200),
    []
  );

  const debouncedUpdateRate = useCallback(
    debounce((rate, loop) => {
      console.log("Changing rate...", rate / 1000);
      if (loop) {
        loop.interval = rate / 1000; // Update loop interval
      }
    }, 200),
    []
  );

  const debouncedUpdateDuration = useCallback(
    debounce((duration, loop) => {
      console.log("Changing duration...", duration / 1000);
      // TO-DO
    }, 200),
    []
  );

  const debouncedUpdateProbability = useCallback(
    debounce((probability, loop) => {
      console.log("Changing probability...", probability);
      if (loop) {
        loop.probability = probability; // Update loop interval
      }
    }, 200),
    []
  );

  // Initialize players when fileUrl or grains change
  useEffect(() => {
    // Side effect logic
    if (!fileUrl) return;
    console.log("URL or grain number changed");
    stopPlayback(); // limit! is it possible to keep playing while changing the grain number?
    debouncedInitializePlayers(fileUrl, grains);

    // Cleanup logic
    return () => {
      // Dispose players on cleanup
      players.forEach((player) => player.dispose());
    };
  }, [fileUrl, grains]); //dependencies (if provided, the effect runs whenever one of those values changes)

  // Update loop interval dynamically when rate changes
  useEffect(() => {
    console.log("Rate value changed");
    debouncedUpdateRate(rate, loop);
  }, [rate]);

  // Update loop callback dynamically when duration changes
  useEffect(() => {
    console.log("Duration value changed");
    debouncedUpdateDuration(duration, loop);
  }, [duration]);

  // Update loop interval dynamically when rate changes
  useEffect(() => {
    console.log("Probability value changed");
    debouncedUpdateProbability(probability, loop);
  }, [probability]);

  // Initialize players and connect to destination
  async function initializePlayers(url, grainNumber) {
    console.log("Initializing players...", grainNumber);
    // Intermediate function is need to have an async block
    const grainPlayers = await createGrainPlayers(url, grainNumber);

    // Connect all players to the audio context's destination
    grainPlayers.forEach((player) => player.toDestination());
    setPlayers(grainPlayers);
    console.log("Players ready!");
  }

  // Create players for all grains
  const createGrainPlayers = async (url, grainNumber) => {
    const grainPlayers = [];
    const audioContext = Tone.getContext();

    // Fetch and decode the audio file
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    console.log(audioBuffer);

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

  // Play a random grain (TO BE EDITED TO PLAY A GRAIN BASED ON SLIDER POSITION)
  const playGrain = (duration) => {
    if (players.length > 0) {
      const randomIndex = Math.floor(Math.random() * players.length);
      const grain = players[randomIndex];

      grain.start(Tone.now());
      grain.stop(Tone.now() + duration / 1000); // Stop based on updated duration
    }
  };

  // Start playback at the specified rate
  const startPlayback = () => {
    if (!isPlaying) {
      setIsPlaying(true);

      // Create a loop for playing grains
      const newLoop = new Tone.Loop((time) => {
        playGrain(duration);
      }, rate / 1000); // Initial interval based on rate
      newLoop.probability = probability;
      // Store loop instance
      newLoop.start(0);
      setLoop(newLoop);

      Tone.getTransport().start();
    }
  };

  // Stop playback
  const stopPlayback = () => {
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

  // HTML
  return (
    <section>
      <div>
        <input
          className="w-full"
          type="range"
          min={0}
          max={grains - 1}
          step={1}
          value={position}
          onChange={(e) => {
            setPosition(Number(e.target.value));
            // Move cursor on the visualizer
            wavesurferInstance.seekTo(e.target.value / grains);
          }}
        ></input>
      </div>
      <div className="rounded-md border-solid border-2 border-black w-min px-2 my-1">
        <button onClick={isPlaying ? stopPlayback : startPlayback}>
          {isPlaying ? "Stop" : "Play"}
        </button>
      </div>
      <div>
        <p>Grain number: {grains}</p>
        <input
          type="range"
          value={grains}
          onChange={(e) => setGrains(Number(e.target.value))}
          min="5"
          max="100"
        />
      </div>
      <div>
        <p>Playback rate (ms): {rate}</p>
        <input
          type="range"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          min="100"
          max="1000"
        />
      </div>
      <div>
        <p>Duration (ms): {duration}</p>
        <input
          type="range"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          min="10"
          max="1000"
        />
      </div>
      <div>
        <p>Probability: {probability}</p>
        <input
          type="range"
          value={probability}
          onChange={(e) => setProbability(Number(e.target.value))}
          min={0}
          max={1}
          step={0.01}
        />
      </div>
    </section>
  );
}

export default Player;
