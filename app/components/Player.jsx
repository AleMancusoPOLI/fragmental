import React, { useEffect, useCallback } from "react";
import * as Tone from "tone";
import debounce from "lodash/debounce";

// importing components of the app
import usePlayerState from "../usePlayerState";
import { initializePlayers, playGrain, startPlayback, stopPlayback } from "../playerFunctions";
import { startRecording, stopRecording } from "../recordingFunctions";
import Slider from "./Slider"

function Player({ fileUrl, wavesurferInstance }) {

  const { state, setters } = usePlayerState();
  const { isPlaying, players, position, grains, rate, duration, loop, probability, recorder, recordedAudioURL, isRecording } = state;
  const { setIsPlaying, setPlayers, setPosition, setGrains, setRate, setDuration, setLoop, setProbability, setRecorder, setRecordedAudioURL, setIsRecording} = setters;

  const debouncedInitializePlayers = useCallback( 
    debounce((url, grainNumber) => {
        initializePlayers(url, grainNumber, setPlayers, setRecorder );
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
      // dispose recorder 
      if (recorder) recorder.dispose(); 
    };
  }, [fileUrl, grains, debouncedInitializePlayers]); //dependencies (if provided, the effect runs whenever one of those values changes)

  // Update loop interval dynamically when rate changes
  useEffect(() => {
    console.log("Rate value changed");
    debouncedUpdateRate(rate, loop);
  }, [rate, debouncedUpdateRate]);

  // Update loop callback dynamically when duration changes
  useEffect(() => {
    console.log("Duration value changed");
    debouncedUpdateDuration(duration, loop);
  }, [duration, debouncedUpdateDuration]);

  // Update loop interval dynamically when rate changes
  useEffect(() => {
    console.log("Probability value changed");
    debouncedUpdateProbability(probability, loop);
  }, [probability, debouncedUpdateProbability]);

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
      {/* onClick expects a function reference, not the result of calling a function (that's why we use anonymus function) */}
            <button onClick={() => 
              isPlaying ? stopPlayback(isPlaying, setIsPlaying, loop, setLoop, players) : startPlayback(isPlaying, setIsPlaying, setLoop, playGrain, rate, probability, duration)}>
                {isPlaying ? "Stop" : "Play"}
            </button>
      </div>
      
      <section>
        <h3>Playback Controls</h3>
        <Slider label="Grain number" value={grains} onChange={setGrains} min={5} max={100} />
        <Slider label="Playback rate (ms)" value={rate} onChange={setRate} min={100} max={1000} />
        <Slider label="Duration (ms)" value={duration} onChange={setDuration} min={10} max={1000} />
        <Slider label="Probability" value={probability} onChange={setProbability} min={0} max={1} step={0.01} />
      </section>

      <div>
        <button onClick={() => 
          isRecording ? stopRecording(recorder, isRecording, setIsRecording, setRecordedAudioURL) : startRecording(recorder, isRecording, setIsRecording)}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        </div>
          { recordedAudioURL && ( // checking if recordedAudioURL exists 
        <div>
            <p>Recording completed.
              <a href={recordedAudioURL} target="_blank" rel="noopener noreferrer" download="recording.wav"> Download the result</a>
            </p>
            <audio controls src={recordedAudioURL}></audio>
        </div>
        )}
    </section>
  );
}

export default Player;