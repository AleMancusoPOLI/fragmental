import React, { useState, useEffect, useCallback } from "react";
import * as Tone from "tone";
import { log } from "tone/build/esm/core/util/Debug";

function Player({ fileUrl, wavesurferInstance }) {
  // the first argument is the current state, the second - function to update the argument
  // useState(arg), arg is the initial state
  const [isPlaying, setIsPlaying] = useState(false); // Boolean for the play/pause button

  const [players, setPlayers] = useState([]); // Array of players, one for each grain

  const [position, setPosition] = useState(0); // Start position
  const [grains, setGrains] = useState(10); // Number of grains
  const [rate, setRate] = useState(500); // Rate in milliseconds
  const [duration, setDuration] = useState(500); // Duration in milliseconds

  const [intervalId, setIntervalId] = useState(null); // To control the playback interval

  //initializePlayers is invoked only after the user stops making changes for at least 500ms
  var debounce = require("lodash/debounce");

  const debouncedInitializePlayers = useCallback(
    debounce((url, grainNumber) => {
      initializePlayers(url, grainNumber);
    }, 500),
    []
  );

  // Initialize players when fileUrl or grains change
  useEffect(() => {
    // Side effect logic
    if (!fileUrl) return;
    console.log("URL or grain number changed");
    stopPlayback(); // limit! is it possible to keep playing while changing the grain number?
    debouncedInitializePlayers(fileUrl, grains);
    //initializePlayers(fileUrl, grains);

    // Cleanup logic
    return () => {
      // Dispose players on cleanup
      players.forEach((player) => player.dispose());
    };
  }, [fileUrl, grains]); //dependencies 

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
  const playGrain = () => {
    if (players.length > 0) {
      const randomIndex = Math.floor(Math.random() * players.length);
      const grain = players[randomIndex];

      grain.start(Tone.now());
      // cut after duration specified by the user (PROBLEM: does not automatically update while playing)
      grain.stop(Tone.now() + duration / 1000);
    }
  };

  // Start playback at the specified rate
  const startPlayback = () => {
    if (!isPlaying) {
      setIsPlaying(true);

      // Play a random grain every `rate` milliseconds
      const id = setInterval(() => {
        playGrain();
      }, rate);

      setIntervalId(id);
    }
  };

  // Stop playback
  const stopPlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      clearInterval(intervalId);
      setIntervalId(null);

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
      <div>
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
          min="1"
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
          min="1"
          max="1000"
        />
      </div>
    </section>
  );
}

export default Player;
