import React, { useEffect, useState } from "react";
import Slider from "./Slider";
import * as Tone from "tone";
import Knob from "./Knob";

function Effects({ gainNode }) {
  const [reverbNode, setReverbNode] = useState(null);
  const [reverb, setReverb] = useState(0);
  const [delayNode, setDelayNode] = useState(null);
  const [delay, setDelay] = useState(0);
  const [chorusNode, setChorusNode] = useState(null);
  const [chorus, setChorus] = useState(0);
  const [crusherNode, setCrusherNode] = useState(null);
  const [crusher, setCrusher] = useState(1);
  const [filterNode, setFilterNode] = useState(null);
  const [darkBright, setDarkBright] = useState(0);

  // Initialize effect nodes
  useEffect(() => {
    if (!gainNode) return;
    console.log("Initializing effects");

    const revNode = new Tone.Reverb(2).set({
      wet: 0,
    });
    const delNode = new Tone.FeedbackDelay(0.125, 0.4).set({
      wet: 0,
    });
    const chorNode = new Tone.Chorus(4, 15, 1).set({
      wet: 0,
    });
    const crushNode = new Tone.BitCrusher(16);
    const filterNode = new Tone.Filter(20000, "allpass");

    setReverbNode(revNode);
    setDelayNode(delNode);
    setChorusNode(chorNode);
    setCrusherNode(crushNode);
    setFilterNode(filterNode);

    gainNode.chain(
      crushNode,
      filterNode,
      chorNode,
      revNode,
      delNode,
      Tone.getDestination()
    );

    return () => {
      console.log("Disposing effects");
      revNode.dispose();
      delNode.dispose();
      chorNode.dispose();
      crushNode.dispose();
      filterNode.dispose();
    };
  }, []);

  useEffect(() => {
    if (!reverbNode) return;
    console.log("Changing reverb...", reverb);
    reverbNode.set({
      wet: reverb,
    });
  }, [reverb]);

  useEffect(() => {
    if (!delayNode) return;
    console.log("Changing delay...", delay);
    delayNode.set({
      wet: delay,
    });
  }, [delay]);

  useEffect(() => {
    if (!chorusNode) return;
    console.log("Changing chorus...", chorus);
    chorusNode.set({
      wet: chorus,
    });
  }, [chorus]);

  useEffect(() => {
    if (!crusherNode) return;
    console.log("Changing crusher...", crusher);
    crusherNode.set({
      bits: 17 - crusher,
    });
  }, [crusher]);

  // Adjust filter based on dark/bright knob
  useEffect(() => {
    if (!filterNode) return;
    console.log("Changing filter...", darkBright);

    if (darkBright < 0) {
      // Low-pass mode
      filterNode.set({
        type: "lowpass",
        frequency: 20000 * (1 + darkBright), // Scale from 20000 to lower frequencies
      });
    } else if (darkBright > 0) {
      // High-pass mode
      filterNode.set({
        type: "highpass",
        frequency: 20 + (20000 - 20) * darkBright, // Scale from 20 Hz to higher frequencies
      });
    } else {
      // Neutral (bypass)
      filterNode.set({
        type: "allpass", // Passes all frequencies
        frequency: 20000,
      });
    }
  }, [darkBright]);

  return (
    <section className="rounded-sm border-solid border-2 border-black p-2">
      <div>
        <div className="flex justify-center">
          <Knob
            label="Reverb"
            value={reverb}
            onChange={setReverb}
            min={0}
            max={1}
            step={0.01}
            defaultValue={0}
            description={"Description"}
          />
          <Knob
            label="Delay"
            value={delay}
            onChange={setDelay}
            min={0}
            max={1}
            step={0.01}
            defaultValue={0}
            description={"Description"}
          />
          <Knob
            label="Chorus"
            value={chorus}
            onChange={setChorus}
            min={0}
            max={1}
            step={0.01}
            defaultValue={0}
            description={"Description"}
          />
          <Knob
            label="Crusher"
            value={crusher}
            onChange={setCrusher}
            min={1}
            max={16}
            step={0.01}
            defaultValue={1}
            description={"Description"}
          />
        </div>

        <div className="flex justify-center items-center h-full">
          <Knob
            label="Dark/Bright"
            value={darkBright}
            onChange={setDarkBright}
            min={-1}
            max={1}
            step={0.01}
            defaultValue={0}
            description={"Description"}
          />
        </div>
      </div>
    </section>
  );
}

export default Effects;
