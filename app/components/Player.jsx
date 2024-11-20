import React, { useState, useEffect } from "react";
import * as Tone from "tone";

function Player({ fileUrl, wavesurferInstance }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);

  const [inputGainNode, setInputGainNode] = useState(null);
  const [inputGain, setInputGain] = useState(0.5);

  const [playbackRate, setPlaybackRate] = useState(1);

  // Initialization when fileUrl changes
  useEffect(() => {
    const gainNode = new Tone.Gain(inputGain).toDestination();
    const tonePlayer = new Tone.Player({
      url: fileUrl,
      loop: true,
      autostart: false,
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

  // Change playback rate value when the input value changes
  useEffect(() => {
    if (player) {
      player.playbackRate = playbackRate;
      if (wavesurferInstance) wavesurferInstance.setPlaybackRate(playbackRate); // update wavesurfer
    }
  }, [playbackRate, player]);

  const togglePlay = async () => {
    if (!player) return;

    if (isPlaying) {
      player.stop(); // stop audio
      setIsPlaying(false); // change value to re-render play button
      if (wavesurferInstance) wavesurferInstance.stop(); // update wavesurfer
    } else {
      await Tone.start(); // start Tone before playing
      player.start(); // start audio
      setIsPlaying(true); // change value to re-render play button
      if (wavesurferInstance) wavesurferInstance.play(); // update wavesurfer
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
    </div>
  );
}

export default Player;
