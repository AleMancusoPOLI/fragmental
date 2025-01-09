import { useState, useCallback } from "react";

const usePlayerState = () => {
  // the first argument is the current state, the second - function to update the argument
  // useState(arg), arg is the initial state

  const [isPlaying, setIsPlaying] = useState(false); // Boolean for the play/pause button
  const [players, setPlayers] = useState([]); // Array of players, one for each grain
  const [position, setPosition] = useState(0); // Start position
  const [range, setRange] = useState(0); // Range of random picking
  const [grains, setGrains] = useState(50); // Number of grains
  const [rate, setRate] = useState(500); // Rate in milliseconds
  const [duration, setDuration] = useState(250); // Duration in milliseconds
  const [loop, setLoop] = useState(null); // To control the loop
  const [probability, setProbability] = useState(1); // The probability of playing a grain

  // Nodes
  const [gain, setGain] = useState(1);
  const [gainNode, setGainNode] = useState(null);
  const [processedNode, setProcessedNode] = useState(null);

  // Envelope
  const [envelope, setEnvelope] = useState([
    { time: 0, amplitude: 0 },
    { time: 0.08, amplitude: 1 },
    { time: 0.8, amplitude: 1 },
    { time: 1, amplitude: 0 },
  ]);
  const [curvatures, setCurvatures] = useState([1, 1, 1]); // Default curvature values for Attack, Decay, Release

  return {
    state: {
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
    },
    setters: {
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
    },
  };
};

export default usePlayerState;
