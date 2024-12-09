import React, { useState, useEffect } from "react";
import * as Tone from "tone";

function Player({ fileUrl, wavesurferInstance }) {
  const [isPlaying, setIsPlaying] = useState(false); // Boolean for the play/pause button

  const [players, setPlayers] = useState([]); // Array of players, one for each grain

  const [position, setPosition] = useState(0); // Start position
  const [grains, setGrains] = useState(10); // Number of grains
  const [rate, setRate] = useState(500); // Rate in milliseconds
  const [duration, setDuration] = useState(500); // Duration in milliseconds

  const [intervalId, setIntervalId] = useState(null); // To control the playback interval

  // Initialize players when fileUrl or grains change
  useEffect(() => {
    if (!fileUrl) return;
    stopPlayback(); // limit! is it possible to keep playing while changing the grain number?
    initializePlayers();

    return () => {
      // Dispose players on cleanup
      players.forEach((player) => player.dispose());
    };
  }, [fileUrl, grains]);

  // Initialize players and connect to destination
  async function initializePlayers() {
    // Intermediate function is need to have an async block
    const grainPlayers = await createGrainPlayers(fileUrl, grains);

    // Connect all players to the audio context's destination
    grainPlayers.forEach((player) => player.toDestination());
    setPlayers(grainPlayers);
  }

  // Create players for all grains
  const createGrainPlayers = async (url, grainCount) => {
    const grainPlayers = [];
    const audioContext = Tone.getContext();

    // Fetch and decode the audio file
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Compute the exact interval between every grain
    const grainDuration = audioBuffer.duration / grainCount;

    // Configure each player for its grain
    for (let i = 0; i < grainCount; i++) {
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
      // cut after suration specified by the user (PROBLEM: does not automatically update while playing)
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
