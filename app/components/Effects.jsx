import React, { useEffect, useState, useCallback } from "react";
import Slider from "./Slider";
import * as Tone from "tone";
import debounce from "lodash/debounce";

function Effects({ gainNode }) {
  const [reverbNode, setReverbNode] = useState(null);
  const [reverb, setReverb] = useState(0);

  // Initialize effect nodes
  useEffect(() => {
    if (!gainNode) return;
    console.log("Initializing effects");
    const revNode = new Tone.Reverb(1).set({
      wet: 0,
    });
    setReverbNode(revNode);
    gainNode.chain(revNode, Tone.getDestination());
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

  useEffect(() => {
    if (!reverbNode) return;
    debouncedUpdateReverb(reverb, reverbNode);
  }, [reverb]);

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
        />
      </div>
    </section>
  );
}

export default Effects;
