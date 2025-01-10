import React, { useEffect, useCallback, useRef, useState } from "react";
import * as Tone from "tone";
import debounce from "lodash/debounce";

// importing components of the app
import usePlayerState from "../usePlayerState";
import {
  initializePlayers,
  startPlayback,
  stopPlayback,
} from "../playerFunctions";
import Knob from "./Knob";

import EnvelopeEditor from "./EnvelopeEditor";
import { applyEnvelope } from "../envelopeLogic";
import Effects from "./Effects";
import Recorder from "./Recorder";

function Player({ fileUrl, wavesurferInstance, onGainNodeReady }) {
  const { state, setters } = usePlayerState();
  const {
    isPlaying,
    players,
    position,
    range,
    grains,
    rate,
    duration,
    loop,
    probability,
    gain,
    gainNode,
    envelope,
    curvatures,
    processedNode,
  } = state;
  const {
    setIsPlaying,
    setPlayers,
    setPosition,
    setRange,
    setGrains,
    setRate,
    setDuration,
    setLoop,
    setProbability,
    setGain,
    setGainNode,
    setEnvelope,
    setCurvatures,
    setProcessedNode,
  } = setters;

  const handleEnvelopeChange = (newEnvelope) => {
    setEnvelope(newEnvelope);
  };

  const handleCurvatureChange = (newCurvatures) => {
    setCurvatures(newCurvatures);
  };

  const debouncedInitializePlayers = useCallback(
    debounce((url, grainNumber, onGainNodeReady, gainNode) => {
      initializePlayers(
        url,
        grainNumber,
        setPlayers,
        gain,
        gainNode,
        setGainNode,
        onGainNodeReady
      );
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

  const durationRef = useRef(duration);
  const positionRef = useRef(position);
  const rangeRef = useRef(range);

  const debouncedUpdateDuration = useCallback(
    debounce((duration) => {
      console.log("Changing duration...", duration / 1000);
      durationRef.current = duration;
    }, 200),
    []
  );

  const debouncedUpdatePosition = useCallback(
    debounce((position) => {
      console.log("Changing position...", position);
      positionRef.current = position;
    }, 200),
    []
  );

  const debouncedUpdateRange = useCallback(
    debounce((range) => {
      console.log("Changing range...", range);
      rangeRef.current = range;
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
    debouncedInitializePlayers(fileUrl, grains, onGainNodeReady, gainNode);

    // update position and range value based on the new number of grains
    let p = position;
    let r = range;
    if (position > grains) {
      p = grains;
      r = grains;
    }
    setPosition(p);
    setRange(r);

    // update visualizer based on the new number of grains
    wavesurferInstance.seekTo(p / grains);
    wavesurferInstance.setOptions({
      cursorWidth: wavesurferInstance.getWidth() / grains,
    });

    // Cleanup logic
    return () => {
      // Dispose players on cleanup
      players.forEach((player) => player.dispose());
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
    debouncedUpdateDuration(duration);
  }, [duration, debouncedUpdateDuration]);

  // Update loop callback dynamically when duration changes
  useEffect(() => {
    console.log("Position value changed");
    debouncedUpdatePosition(position);
  }, [position, debouncedUpdatePosition]);

  // Update loop callback dynamically when duration changes
  useEffect(() => {
    console.log("Range value changed");
    debouncedUpdateRange(range);
  }, [range, debouncedUpdateRange]);

  // Update loop interval dynamically when rate changes
  useEffect(() => {
    console.log("Probability value changed");
    debouncedUpdateProbability(probability, loop);
  }, [probability, debouncedUpdateProbability]);

  useEffect(() => {
    if (gainNode == null) return;
    console.log("Gain value changed");
    gainNode.gain.rampTo(gain, 0.01);
  }, [gain]);

  // Update envelope when it changes
  useEffect(() => {
    if (players) {
      applyEnvelope(players, envelope);
    }
  }, [envelope, players]);

  const handlePlayButton = (e) => {
    e.preventDefault();
    const isRightKey = e.type === "keyup" && e.key === "p"; // edit for key to press
    const isClick = e.type === "click";

    if (isRightKey || isClick) {
      if (isPlaying) {
        stopPlayback(isPlaying, setIsPlaying, loop, setLoop, players);
      } else {
        Tone.start()
          .then(() => {
            console.log("AudioContext started");
            startPlayback(
              players,
              isPlaying,
              setIsPlaying,
              setLoop,
              rate,
              probability,
              durationRef, // Pass refs instead of functions
              positionRef,
              rangeRef,
              envelope,
              gainNode
            );
          })
          .catch((err) => {
            console.error("Error starting AudioContext:", err);
          });
      }
    }
  };

  useEffect(() => {
    const keyListener = (e) => handlePlayButton(e);

    // Attach the event listener
    window.addEventListener("keyup", keyListener);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("keyup", keyListener);
    };
  }, [
    isPlaying,
    loop,
    players,
    rate,
    probability,
    durationRef,
    positionRef,
    rangeRef,
    envelope,
    gainNode,
  ]);

  // HTML
  return (
    <section className="px-4 sm:px-8 lg:px-16 py-4 sm:py-8">
  <div>
    {/* Scalable Range Input */}
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
    />
  </div>

  {/* Play Button */}
  <div className="rounded-md border-solid border-2 border-black w-min px-4 py-2 my-4">
    <button onClick={handlePlayButton}>
      {isPlaying ? "Stop" : "Play"}
    </button>
  </div>

  {/* Row 1: Recorder, Envelope, and Knobs */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
    {/* Recorder Section */}
    <div className="flex flex-col items-center">
      {processedNode && <Recorder node={processedNode} />}
    </div>

    {/* Envelope Section */}
    <div className="flex flex-col items-center">
      <EnvelopeEditor
        points={envelope}
        onChange={handleEnvelopeChange}
        curvatures={curvatures}
        onCurvatureChange={handleCurvatureChange}
      />
    </div>

    {/* Knobs Section */}
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <div className="flex flex-col items-center">
        <Knob
          label="Range"
          value={range}
          onChange={(newValue) => setRange(newValue)}
          min={0}
          max={grains}
          step={1}
          defaultValue={0}
        />
      </div>
      <div className="flex flex-col items-center">
        <Knob
          label="Gain"
          value={gain}
          onChange={setGain}
          min={0}
          max={2}
          step={0.01}
          defaultValue={1}
        />
      </div>
      <div className="flex flex-col items-center">
        <Knob
          label="Grain number"
          value={grains}
          onChange={setGrains}
          min={5}
          max={100}
          defaultValue={50}
        />
      </div>
      <div className="flex flex-col items-center">
        <Knob
          label="Playback rate (ms)"
          value={rate}
          onChange={setRate}
          min={100}
          max={1000}
          defaultValue={500}
        />
      </div>
      <div className="flex flex-col items-center">
        <Knob
          label="Duration (ms)"
          value={duration}
          onChange={setDuration}
          min={10}
          max={1000}
          defaultValue={250}
        />
      </div>
      <div className="flex flex-col items-center">
        <Knob
          label="Probability"
          value={probability}
          onChange={setProbability}
          min={0}
          max={1}
          step={0.01}
          defaultValue={1}
        />
      </div>
    </div>
  </div>

  {/* Row 2: Effects */}
  <div className="mt-8">
    {gainNode && (
      <div className="flex flex-col items-center">
        <Effects
          gainNode={gainNode}
          onProcessedNodeReady={setProcessedNode}
        />
      </div>
    )}
  </div>
</section>

  );
}

export default Player;
