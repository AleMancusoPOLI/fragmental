import React, { useEffect } from "react";
import Knob from "./Knob";

function CompositeEffect({
  effectNodes,
  label,
  value,
  onChange,
  min,
  max,
  step,
  defaultValue,
  description,
}) {
  useEffect(() => {
    if (!effectNodes) return;

    effectNodes.forEach(({ param, min, max }) => {
      if (param) {
        const computedValue = min + value * (max - min);
        param.value = computedValue;
      }
    });
  }, [value, effectNodes]);

  return (
    <section className="rounded-sm p-2">
      <div>
        <div className="flex justify-center">
          <Knob
            label={label}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            defaultValue={defaultValue}
            description={description}
          />
        </div>
      </div>
    </section>
  );
}

export default CompositeEffect;
