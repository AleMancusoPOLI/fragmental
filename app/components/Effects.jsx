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

  const [robot, setRobot] = useState(0);
  const [robotHighPass, setRobotHighPass] = useState(null);
  const [robotFilter, setRobotFilter] = useState(null);
  const [robotDist, setRobotDist] = useState(null);
  const [robotReverb, setRobotReverb] = useState(null);

  const [bubbly, setBubbly] = useState(0);
  const [bubblyPhaser, setBubblyPhaser] = useState(null);
  const [bubblyTremolo, setBubblyTremolo] = useState(null);

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

    // ROBOT
    const robot_highPass = new Tone.Filter(20, "highpass");
    const robot_filter = new Tone.AutoFilter("4n").start();
    const robot_dist = new Tone.Chebyshev(50);
    const robot_reverb = new Tone.Freeverb();
    robot_reverb.wet.value = 0;
    robot_reverb.dampening = 1000;
    robot_reverb.roomSize.value = 0.1;

    setRobotHighPass(robot_highPass);
    setRobotFilter(robot_filter);
    setRobotDist(robot_dist);
    setRobotReverb(robot_reverb);

    // FUNKY
    const bubbly_phaser = new Tone.Phaser({
      frequency: 0.5,
      octaves: 2,
      baseFrequency: 350,
    });
    bubbly_phaser.wet.value = 0;

    const bubbly_tremolo = new Tone.Tremolo(9, 0.75).start();
    bubbly_tremolo.wet.value = 0;

    setBubblyPhaser(bubbly_phaser);
    setBubblyTremolo(bubbly_tremolo);

    const processedGain = new Tone.Gain();
    // Rooting
    gainNode.chain(
      vintage_bitCrusher,
      vintage_lowPass,
      vintage_reverb, //
      dreamy_highPass,
      dreamy_chorus,
      dreamy_reverb,
      dreamy_delay, //
      robot_dist,
      robot_highPass,
      robot_filter,
      robot_reverb, //
      bubbly_phaser,
      bubbly_tremolo, //
      processedGain
    );

    processedGain.connect(Tone.getDestination());
    onProcessedNodeReady(processedGain);

    return () => {
      console.log("Disposing effects");
      vintage_lowPass.dispose();
      vintage_bitCrusher.dispose();
      vintage_reverb.dispose();
      dreamy_highPass.dispose();
      dreamy_chorus.dispose();
      dreamy_reverb.dispose();
      dreamy_delay.dispose();
      robot_dist.dispose();
      robot_highPass.dispose();
      robot_filter.dispose();
      robot_reverb.dispose();
      bubbly_phaser.dispose();
      bubbly_tremolo.dispose();
    };
  }, []);

  return (
    // <section className="flex justify-center items-center gap-6 p-4 bg-gray-900 text-white rounded-md w-full">
    <section>
      <div>
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <CompositeEffect
              label="Vintage"
              value={vintage}
              onChange={setVintage}
              min={0}
              max={1}
              step={0.01}
              defaultValue={0}
              description={
                "Straight out of a gramophone, with a touch of long reverb"
              }
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
          </div>
          <div className="flex flex-col items-center">
            <CompositeEffect
              label="Dreamy"
              value={dreamy}
              onChange={setDreamy}
              min={0}
              max={1}
              step={0.01}
              defaultValue={0}
              description={"Ethereal vibes supported by a bunch of delay"}
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
            /></div>
          <div className="flex flex-col items-center">
            <CompositeEffect
              label="Robot"
              value={robot}
              onChange={setRobot}
              min={0}
              max={1}
              step={0.01}
              defaultValue={0}
              description={
                "Industrial sound voiced by a lonely robot, pairs well with the Vintage effect"
              }
              effectNodes={[
                {
                  param: robotFilter?.frequency,
                  min: 19980,
                  max: 40,
                },
                {
                  param: robotFilter?.depth,
                  min: 1,
                  max: 1,
                },
                {
                  param: robotFilter?.wet,
                  min: 0,
                  max: 1,
                },
                {
                  param: robotDist?.wet,
                  min: 0,
                  max: 0.1,
                },
                {
                  param: { value: robotDist?.order },
                  min: 50,
                  max: 58,
                },
                {
                  param: robotHighPass?.frequency,
                  min: 20,
                  max: 800,
                },
                {
                  param: robotReverb?.wet,
                  min: 0,
                  max: 0.2,
                },
                {
                  param: robotReverb?.roomSize,
                  min: 0.1,
                  max: 0.5,
                },
              ]}
            /></div>
          <div className="flex flex-col items-center"></div>
          <CompositeEffect
            label="Bubbly"
            value={bubbly}
            onChange={setBubbly}
            min={0}
            max={1}
            step={0.01}
            defaultValue={0}
            description={
              "Fizzy vibes with phaser and tremolo, keep at low values for a nice flow"
            }
            effectNodes={[
              {
                param: bubblyPhaser?.wet,
                min: 0,
                max: 1,
              },
              {
                param: bubblyPhaser?.frequency,
                min: 0.1,
                max: 10,
              },
              {
                param: bubblyTremolo?.wet,
                min: 0,
                max: 1,
              },
              {
                param: bubblyTremolo?.frequency,
                min: 10,
                max: 15,
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

export default Effects;
