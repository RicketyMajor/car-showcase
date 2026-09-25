"use client";

import { useId } from "react";

export type View = "top" | "side";

// Native radios, so arrow keys move between the views with no script of ours.
// "dark" sits on a graphite stage (the dialog), "light" on the showroom floor.
const TONES = {
  dark: {
    group: "bg-chalk/10",
    option: "text-chalk/70 hover:text-chalk has-[:checked]:bg-chalk has-[:checked]:text-stage has-[:focus-visible]:outline-chalk",
  },
  light: {
    group: "bg-black-100/5",
    option: "text-grey hover:text-black-100 has-[:checked]:bg-stage has-[:checked]:text-chalk has-[:focus-visible]:outline-primary-blue",
  },
} as const;

interface ViewSwitchProps {
  value: View;
  onChange: (view: View) => void;
  tone: keyof typeof TONES;
  className?: string;
}

const ViewSwitch = ({ value, onChange, tone, className = "" }: ViewSwitchProps) => {
  const name = useId();
  const colours = TONES[tone];

  return (
    <fieldset className={`flex gap-0.5 rounded-full p-1 ${colours.group} ${className}`}>
      <legend className="sr-only">View</legend>
      {(["top", "side"] as const).map((option) => (
        <label
          key={option}
          className={`cursor-pointer rounded-full px-3 py-1.5 type-label transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${colours.option}`}
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="sr-only"
          />
          {option === "top" ? "Top" : "Side"}
        </label>
      ))}
    </fieldset>
  );
};

export default ViewSwitch;
