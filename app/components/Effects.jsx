import React, { useEffect, useState, useCallback } from "react";
import Slider from "./Slider";
import * as Tone from "tone";
import debounce from "lodash/debounce";

function Effects({ gainNode }) {
  const [reverbNode, setReverbNode] = useState(null);
  const [reverb, setReverb] = useState(0);
  const [delayNode, setDelayNode] = useState(null);
  const [delay, setDelay] = useState(0);
  const [chorusNode, setChorusNode] = useState(null);
  const [chorus, setChorus] = useState(0);

  // Initialize effect nodes
  useEffect(() => {
    if (!gainNode) return;
    console.log("Initializing effects");

    const revNode = new Tone.Reverb(1).set({
      wet: 0,
    });
    const delNode = new Tone.FeedbackDelay(0.25, 0.5).set({
      wet: 0,
    });
    const chorNode = new Tone.Chorus(4, 25, 1).set({
      wet: 0,
    });

    setReverbNode(revNode);
    setDelayNode(delNode);
    setChorusNode(chorNode);

    gainNode.chain(revNode, delNode, chorNode, Tone.getDestination());
  }, [gainNode]);

  const debouncedUpdateReverb = useCallback(
    debounce((reverb, reverbNode) => {
      console.log("Changing reverb...", reverb);
      reverbNode.set({
        wet: reverb,
      });
    }, 200),
    []
  );

  const debouncedUpdateDelay = useCallback(
    debounce((delay, delayNode) => {
      console.log("Changing delay...", delay);
      delayNode.set({
        wet: delay,
      });
    }, 200),
    []
  );

  const debouncedUpdateChorus = useCallback(
    debounce((chorus, chorusNode) => {
      console.log("Changing chorus...", chorus);
      chorusNode.set({
        wet: chorus,
      });
    }, 200),
    []
  );

  useEffect(() => {
    if (!reverbNode) return;
    debouncedUpdateReverb(reverb, reverbNode);
  }, [reverb]);

  useEffect(() => {
    if (!delayNode) return;
    debouncedUpdateDelay(delay, delayNode);
  }, [delay]);

  useEffect(() => {
    if (!chorusNode) return;
    debouncedUpdateChorus(chorus, chorusNode);
  }, [chorus]);

  return (
    <section className="rounded-sm border-solid border-2 border-black p-2">
      <div>
        <Slider
          label="Reverb"
          value={reverb}
          onChange={setReverb}
          min={0}
          max={1}
          step={0.01}
          defaultValue={0}
        />
        <Slider
          label="Delay"
          value={delay}
          onChange={setDelay}
          min={0}
          max={1}
          step={0.01}
          defaultValue={0}
        />
        <Slider
          label="Chorus"
          value={chorus}
          onChange={setChorus}
          min={0}
          max={1}
          step={0.01}
          defaultValue={0}
        />
      </div>
    </section>
  );
}

export default Effects;
