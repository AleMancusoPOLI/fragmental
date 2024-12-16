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
  const { isPlaying, players, position, range, grains, rate, duration, loop, probability, recorder, recordedAudioURL, isRecording, gain, gainNode, pitch, pitchNode } = state;
  const { setIsPlaying, setPlayers, setPosition, setRange, setGrains, setRate, setDuration, setLoop, setProbability, setRecorder, setRecordedAudioURL, setIsRecording, setGain, setGainNode, setPitch, setPitchNode } = setters;

  const debouncedInitializePlayers = useCallback(
    debounce((url, grainNumber) => {
      initializePlayers(url, grainNumber, setPlayers, setRecorder, gain, setGainNode, setPitchNode);
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
    stopPlayback(isPlaying, setIsPlaying, loop, setLoop, players); // limit! is it possible to keep playing while changing the grain number?
    debouncedInitializePlayers(fileUrl, grains);

    // update position and range value based on the new number of grains
    let p = position
    let r = range
    if (position > grains) {
      p = grains
      r = grains
    }
    setPosition(p)
    setRange(r)

    // update visualizer based on the new number of grains
    wavesurferInstance.seekTo(p / grains);
    wavesurferInstance.setOptions({ cursorWidth: wavesurferInstance.getWidth() / grains });


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

  useEffect(() => {
    if (gainNode == null) return
    console.log("Gain value changed");
    gainNode.gain.rampTo(gain, 0.01);
  }, [gain]);

  useEffect(() => {
    if (pitchNode == null) return
    console.log("Pitch value changed");
    pitchNode.pitch = pitch;
  }, [pitch]);

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
        <p>Range: {range}</p>
        <input
          type="range"
          min={0}
          max={grains}
          step={1}
          value={range}
          onChange={(e) => {
            setRange(Number(e.target.value));
            // Move cursor on the visualizer
          }}
        ></input>
      </div>
      <div className="rounded-md border-solid border-2 border-black w-min px-2 my-1">
        {/* onClick expects a function reference, not the result of calling a function (that's why we use anonymus function) */}
        <button
          onClick={() => {
            if (isPlaying) {
              stopPlayback(isPlaying, setIsPlaying, loop, setLoop, players);
            } else {
              Tone.start()
                .then(() => {
                  console.log("AudioContext started");
                  startPlayback(players, isPlaying, setIsPlaying, setLoop, playGrain, rate, probability, duration, position, range);
                })
                .catch((err) => {
                  console.error("Error starting AudioContext:", err);
                });
            }
          }}
        >
          {isPlaying ? "Stop" : "Play"}
        </button>

      </div>

      <section>
        <h3>Playback Controls</h3>
        <Slider label="Gain" value={gain} onChange={setGain} min={0} max={2} step={0.01} />
        <Slider label="Pitch" value={pitch} onChange={setPitch} min={-12} max={12} />

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
      {recordedAudioURL && ( // checking if recordedAudioURL exists 
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