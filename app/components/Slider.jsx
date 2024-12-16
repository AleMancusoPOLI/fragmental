function Slider({ label, value, onChange, min, max, step = 1 }) {
    return (
      <div>
        <p>{label}: {value}</p>
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
        />
      </div>
    );
  }
  
  export default Slider;