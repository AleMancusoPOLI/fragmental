import Image from "next/image";
import Tooltip from "./Tooltip";

function Knob({ label, value, onChange, min, max, step = 1, defaultValue, description, width=70, height=70 }) {
  const range = max - min;
  const rotation = ((value - min) / range) * 270 - 135; // Map value to rotation (-135° to 135°)

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startValue = value;

    const onMouseMove = (moveEvent) => {
      const deltaY = startY - moveEvent.clientY; // Vertical movement
      const deltaValue = (deltaY / 200) * range; // Scale movement to the range
      const newValue = Math.min(Math.max(startValue + deltaValue, min), max); // Clamp within range

      onChange(Math.round(newValue / step) * step); // Round to the nearest step
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleWheel = (e) => {
    e.preventDefault(); // Prevent page scroll

    const delta = e.deltaY < 0 ? 1 : -1; // Scroll up -> increment, scroll down -> decrement
    const newValue = Math.min(Math.max(value + delta * step, min), max);
    onChange(Math.round(newValue / step) * step); // Round to the nearest step
  };

  // Attach the wheel event listener with passive: false to prevent default scroll behavior
  const knobElement = document.getElementById(`knob-${label}`);
  if (knobElement) {
    knobElement.addEventListener("wheel", handleWheel, { passive: false });
  }

  return (
    <div
      id={`knob-${label}`}
      className="py-3 mx-3 flex flex-col items-center relative group w-24" // fixed width to ensure all knobs look the same
    >
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onChange(defaultValue)}
        className="w-15 h-15 cursor-grab select-none"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <Image
          src="/assets/Knob.png"
          alt="Knob"
          width={width}
          height={height}
          style={{ pointerEvents: "none" }}
        />
      </div>

      <Tooltip description={description} value={value.toFixed(2)} />

      <p className="text-sm mt-2 text-center">{label}</p>
    </div>
  );
}

export default Knob;
