import * as Tone from "tone";

export const applyEnvelope = (players, envelope) => {
  const isValidEnvelope = envelope.every(
    (point) => typeof point.time === "number" && typeof point.amplitude === "number"
  );
  if (!isValidEnvelope) {
    console.error("Invalid envelope structure:", envelope);
    return;
  }
  console.log("Applying envelope:", envelope);
  
  const now = Tone.now();
  players.forEach((player) => {
    console.log(player.gainNode)
    if (!player.gainNode) {
      player.gainNode = new Tone.Gain(0).toDestination();
      player.connect(player.gainNode);
    }
    console.log(player.gainNode)

    envelope.forEach((point, i) => {
      if (i === 0) {
        player.gainNode.gain.setValueAtTime(point.amplitude, now + point.time);
      } else {
        player.gainNode.gain.linearRampToValueAtTime(point.amplitude, now + point.time);
      }
    });
  });
};

export const mapEnvelopeToDuration = (envelope, duration) => {
  return envelope.map((point) => ({
    time: point.time * duration, 
    amplitude: point.amplitude,
  }));
};

