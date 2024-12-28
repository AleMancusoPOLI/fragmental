function Slider({ label, value, onChange, min, max, step = 1, defaultValue }) {
  return (
    <div>
      <p>
        {label}: {value}
      </p>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onDoubleClick={() => onChange(defaultValue)}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}

export default Slider;
