import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import CompositeEffect from "./CompositeEffect";

function Effects({ gainNode, onProcessedNodeReady }) {
  const [vintage, setVintage] = useState(0);
  const [vintageLowPass, setVintageLowPass] = useState(null);
  const [vintageBitCrusher, setVintageBitCrusher] = useState(null);
  const [vintageReverb, setVintageReverb] = useState(null);

  const [dreamy, setDreamy] = useState(0);
  const [dreamyHighPass, setDreamyHighPass] = useState(null);
  const [dreamyChorus, setDreamyChorus] = useState(null);
  const [dreamyReverb, setDreamyReverb] = useState(null);
  const [dreamyDelay, setDreamyDelay] = useState(null);

  const [underwater, setUnderwater] = useState(0);
  const [underwaterBandPass, setUnderwaterBandPass] = useState(null);

  // Initialize effect nodes
  useEffect(() => {
    if (!gainNode) return;
    console.log("Initializing effects");

    // VINTAGE
    const vintage_lowPass = new Tone.Filter(20000, "lowpass");
    const vintage_bitCrusher = new Tone.BitCrusher(3);
    vintage_bitCrusher.wet.value = 0;
    const vintage_reverb = new Tone.Reverb(2);
    vintage_reverb.wet.value = 0;

    setVintageLowPass(vintage_lowPass);
    setVintageBitCrusher(vintage_bitCrusher);
    setVintageReverb(vintage_reverb);

    // DREAMY
    const dreamy_highPass = new Tone.Filter(20, "highpass");
    const dreamy_chorus = new Tone.Chorus(20, 0, 1);
    const dreamy_reverb = new Tone.Reverb(1.5);
    dreamy_reverb.wet.value = 0;
    const dreamy_delay = new Tone.FeedbackDelay(0, 0.5);
    dreamy_delay.wet.value = 0;

    setDreamyHighPass(dreamy_highPass);
    setDreamyChorus(dreamy_chorus);
    setDreamyReverb(dreamy_reverb);
    setDreamyDelay(dreamy_delay);

    // UNDERWATER
    const uw_bandPass = new Tone.Filter(20, "bandpass");

    setUnderwaterBandPass(uw_bandPass);

    const processedGain = new Tone.Gain();
    // Rooting
    gainNode.chain(
      vintage_bitCrusher,
      vintage_lowPass,
      vintage_reverb,
      dreamy_highPass,
      dreamy_chorus,
      dreamy_reverb,
      dreamy_delay,
      //uw_bandPass,
      processedGain
    );

    processedGain.connect(Tone.getDestination());
    onProcessedNodeReady(processedGain);

    return () => {
      console.log("Disposing effects");
      vintage_lowPass.dispose();
      vintage_bitCrusher.dispose();
      vintage_reverb.dispose();
      // etc
    };
  }, []);

  return (
    <section className="rounded-sm border-solid border-2 border-black p-2">
      <div>
        <div className="flex justify-center">
          <CompositeEffect
            label="Vintage"
            value={vintage}
            onChange={setVintage}
            min={0}
            max={1}
            step={0.01}
            defaultValue={0}
            description={"Just like grandpa likes it"}
            effectNodes={[
              {
                param: vintageLowPass?.frequency,
                min: 20000,
                max: 400,
              },
              {
                param: vintageBitCrusher?.wet,
                min: 0,
                max: 0.1,
              },
              {
                param: vintageBitCrusher?.bits,
                min: 10,
                max: 2,
              },
              {
                param: vintageReverb?.wet,
                min: 0,
                max: 1,
              },
            ]}
          />
          <CompositeEffect
            label="Dreamy"
            value={dreamy}
            onChange={setDreamy}
            min={0}
            max={1}
            step={0.01}
            defaultValue={0}
            description={"Honk shuu honk shuu"}
            effectNodes={[
              {
                param: dreamyHighPass?.frequency,
                min: 20,
                max: 1500,
              },
              {
                param: dreamyChorus?.delayTime,
                min: 0,
                max: 2000,
              },
              {
                param: dreamyReverb?.wet,
                min: 0,
                max: 0.8,
              },
              {
                param: dreamyDelay?.wet,
                min: 0,
                max: 0.5,
              },
              {
                param: dreamyDelay?.delayTime,
                min: 0,
                max: 0.25,
              },
            ]}
          />
          <CompositeEffect
            label="Underwater"
            value={underwater}
            onChange={setUnderwater}
            min={0}
            max={1}
            step={0.01}
            defaultValue={0}
            description={"blub blub blub"}
            effectNodes={[
              {
                param: underwaterBandPass?.frequency,
                min: 19980,
                max: 40,
              },
              {
                param: underwaterBandPass?.Q,
                min: 0.1,
                max: 0.1,
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

export default Effects;
