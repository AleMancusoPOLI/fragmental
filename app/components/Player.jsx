import React, { useState, useEffect } from "react";
import * as Tone from "tone";

function Player({ fileUrl, wavesurferInstance }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);

  const [timer, setTimer] = useState(null);

  const [inputGainNode, setInputGainNode] = useState(null);
  const [inputGain, setInputGain] = useState(0.5);

  const [playbackRate, setPlaybackRate] = useState(1);

  const [grainSize, setGrainSize] = useState(0.1);
  const [overlap, setOverlap] = useState(0.1);

  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(wavesurferInstance.getDuration());

  // Initialization when fileUrl changes
  useEffect(() => {
    const gainNode = new Tone.Gain(inputGain).toDestination();
    const tonePlayer = new Tone.GrainPlayer({
      url: fileUrl,
      loop: true,
      autostart: false,
      grainSize: grainSize,
      overlap: overlap,
      loopStart: loopStart,
      loopEnd: wavesurferInstance.getDuration(),
    }).connect(gainNode);

    setPlayer(tonePlayer);
    setInputGainNode(gainNode);

    return () => {
      tonePlayer.dispose();
      gainNode.dispose();
    };
  }, [fileUrl]);

  // Change gain node value when the input value changes
  useEffect(() => {
    if (inputGainNode) {
      inputGainNode.gain.setValueAtTime(inputGain, Tone.now());
    }
  }, [inputGain, inputGainNode]);

  useEffect(() => {
    if (player) {
      player.playbackRate = playbackRate;
      player.grainSize = grainSize;
      player.overlap = overlap;
      player.loopStart = loopStart;
      player.loopEnd = loopEnd;

      if (wavesurferInstance) wavesurferInstance.setPlaybackRate(playbackRate);
    }
  }, [playbackRate, grainSize, overlap, loopStart, loopEnd, player]);

  const togglePlay = async () => {
    if (!player) return;

    if (isPlaying) {
      player.stop(); // stop audio
      setIsPlaying(false); // change value to re-render play button
      if (wavesurferInstance) wavesurferInstance.stop(); // update wavesurfer
      if (timer) {
        clearInterval(timer); // stop the timer
        setTimer(null); // reset the timer state
      }
    } else {
      await Tone.start(); // start Tone before playing
      player.start(); // start audio
      setIsPlaying(true); // change value to re-render play button
      if (wavesurferInstance) {
        wavesurferInstance.play(); // update wavesurfer
        const newTimer = setInterval(
          () => wavesurferInstance.play(),
          wavesurferInstance.getDuration()
        );
        setTimer(newTimer);
      }
    }
  };

  return (
    <div>
      <button
        onClick={togglePlay}
        className="border border-solid border-black rounded p-1 my-2"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <p>Input Gain: {inputGain.toFixed(2)}</p>
      <input
        type="range"
        min="0"
        max="2"
        step="0.01"
        value={inputGain}
        onChange={(e) => setInputGain(parseFloat(e.target.value))}
      />

      <p>Playback Rate: {playbackRate.toFixed(2)}</p>
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.01"
        value={playbackRate}
        onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
      />

      <p>Grain Size: {grainSize.toFixed(3)}</p>
      <input
        type="range"
        min="0.001"
        max="0.5"
        step="0.001"
        value={grainSize}
        onChange={(e) => setGrainSize(parseFloat(e.target.value))}
      />

      <p>Overlap: {overlap.toFixed(3)}</p>
      <input
        type="range"
        min="0.001"
        max="0.5"
        step="0.001"
        value={overlap}
        onChange={(e) => setOverlap(parseFloat(e.target.value))}
      />

      <p>Loop Start: {loopStart.toFixed(2)} seconds</p>
      <input
        type="range"
        min="0"
        max={wavesurferInstance.getDuration() - 0.01}
        step="0.01"
        value={loopStart}
        onChange={(e) => setLoopStart(parseFloat(e.target.value))}
      />

      <p>Loop End: {loopEnd.toFixed(2)} seconds</p>
      <input
        type="range"
        min="0.01"
        max={wavesurferInstance.getDuration()}
        step="0.01"
        value={loopEnd}
        onChange={(e) => setLoopEnd(parseFloat(e.target.value))}
      />
    </div>
  );
}

export default Player;
