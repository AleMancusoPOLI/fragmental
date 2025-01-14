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

function Player({ fileUrl, wavesurferInstance, onGainNodeReady, onPlayGrain }) {
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
    console.log("position:", position, "range:", range, "grains:", grains);
    if (position >= grains) {
      setPosition(grains - 1);
    }
    if (range >= grains) {
      setRange(grains);
    }

    // update visualizer based on the new number of grains
    wavesurferInstance.seekTo(position / grains);
    wavesurferInstance.setOptions({
      cursorWidth: wavesurferInstance.getWidth() / grains,
    });

    // Cleanup logic
    return () => {
      // Dispose players on cleanup
      players.forEach((player) => player.dispose());
    };
  }, [fileUrl, grains, debouncedInitializePlayers]); //dependencies (if provided, the effect runs whenever one of those values changes)

  useEffect(() => {
    if (!wavesurferInstance) return;
    wavesurferInstance.seekTo(position / grains);
    wavesurferInstance.setOptions({
      cursorWidth: wavesurferInstance.getWidth() / grains,
    });
  }, [wavesurferInstance]);

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
              gainNode,
              onPlayGrain
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
    <section className="pt-8">
      {/* First Row */}
      <div className="flex justify-center items-center gap-6 px-4 bg-gray-200 text-black rounded-md w-full">
        {/* Play Button */}
        <button
          onClick={handlePlayButton}
          className="w-12 h-12 bg-purple-400 hover:bg-purple-300 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95"
        >
          {/* Play / Pause Icon */}
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect
                x="4"
                y="4"
                width="16"
                height="16"
                fill="currentColor" // Ensures the square is filled
                stroke="none" // Removes the stroke for a solid square
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3L19 12L5 21V3Z" // Play Icon (triangle)
              />
            </svg>
          )}
          <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
        </button>

        {/* Scalable Range Input */}
        <input
          className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-purple-400"
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

        {/* Knob Section */}
        <Knob
          label="Gain"
          value={gain}
          onChange={setGain}
          min={0}
          max={2}
          step={0.01}
          defaultValue={1}
          description={"Overall volume, before effects have been applied"}
          width={50}
          height={50}
          className="text-sm"
        />
      </div>

      {/* Add spacing between rows */}
      <div className="mt-4"></div>

      {/* Row 1: Recorder, Envelope, and Knobs */}
      <div className="rounded-md grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Knobs Section */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 rounded-md">
          {/* First Row: 3 Knobs */}
          <div className="flex justify-center p-2 sm:p-2 gap-6 col-span-3 rounded-md bg-gray-200">
            <div className="flex flex-col items-center">
              <Knob
                label="Range"
                value={range}
                onChange={(newValue) => setRange(newValue)}
                min={0}
                max={grains}
                step={1}
                defaultValue={0}
                description={
                  <>
                    <span className="text-center block">Range for selecting grains.</span>
                    <span className="text-center block mt-0">{' '}Higher values may create less coherent sequences</span>
                  </>
                }
                width={60}
                height={60}
              />
            </div>
            <div className="flex flex-col items-center">
              <Knob
                label="Grain size"
                value={grains}
                onChange={setGrains}
                min={1}
                max={100}
                defaultValue={50}
                description={
                  "Length of each grain, also affecting the total number of grains"
                }
                width={80}
                height={80}
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
                description={
                  "How likely is for every individual node to be skipped"
                }
                width={60}
                height={60}
              />
            </div>
          </div>
          {/* Second Row: 2 Knobs */}
          <div className="flex justify-center gap-16 p-2 sm:p-2 col-span-3 rounded-md bg-gray-200">
            <div className="flex flex-col items-center">
              <Knob
                label="Playback rate"
                value={rate}
                onChange={setRate}
                min={100}
                max={1000}
                defaultValue={550}
                description={"How fast are grains played one after the other"}
                width={60}
                height={60}
              />
            </div>
            <div className="flex flex-col items-center">
              <Knob
                label="Duration"
                value={duration}
                onChange={setDuration}
                min={10}
                max={1000}
                defaultValue={505}
                description={
                  <>
                    <span className="text-center block">How long each grain plays for.</span>
                    <span className="text-center block mt-0">{' '}The envelope length is based on this value</span>
                  </>
                }
                width={60}
                height={60}
              />
            </div>
          </div>
        </div>

        {/* Envelope Section */}
        <div className="flex flex-col items-center bg-gray-200 rounded-md">
          <EnvelopeEditor
            points={envelope}
            onChange={handleEnvelopeChange}
            curvatures={curvatures}
            onCurvatureChange={handleCurvatureChange}
          />
        </div>

        {/* Recorder Section */}
        <div className="flex flex-col items-center bg-gray-200 rounded-md">
          {processedNode && <Recorder node={processedNode} />}
        </div>
      </div>

      {/* Add spacing before the second row */}
      <div className="mt-4"></div>

      {/* Row 2: Effects */}
      <div>
        {gainNode && (
          <div className="flex flex-col items-center w-full">
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
