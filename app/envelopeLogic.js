import * as Tone from "tone";

export const applyEnvelope = (players, envelope, gainNode) => {
  const isValidEnvelope = envelope.every(
    (point) => typeof point.time === "number" && typeof point.amplitude === "number"
  );
  if (!isValidEnvelope) {
    console.error("Invalid envelope structure:", envelope);
    return;
  }

  // Ensure the envelope is sorted by time
  const sortedEnvelope = [...envelope].sort((a, b) => a.time - b.time);

  players.forEach((player) => {
    if (!player.gainNode) {
      player.gainNode = new Tone.Gain(0);
    }

    // Connect the player to the gain node
    player.connect(player.gainNode);

    // Apply the envelope to the gain node
    const now = Tone.now();
    sortedEnvelope.forEach((point, i) => {
      if (i === 0) {
        player.gainNode.gain.setValueAtTime(point.amplitude, now + point.time);
      } else {
        player.gainNode.gain.linearRampToValueAtTime(point.amplitude, now + point.time);
      }
    });
  });
};
