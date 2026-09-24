// The template's icons each brought their own colour, from no palette in this
// app. Drawn here on one 16-unit grid with one stroke, they take the colour of
// whatever they sit in - chalk on the stage, ink on the floor.
type IconProps = { className?: string };

const base = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const SearchIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="7" cy="7" r="4.5" />
    <path d="m10.5 10.5 3.5 3.5" />
  </svg>
);

export const CloseIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="m4 4 8 8M12 4l-8 8" />
  </svg>
);

export const ChevronIcon = ({ className = "w-4 h-4" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="m5 6.5 3-3 3 3M5 9.5l3 3 3-3" />
  </svg>
);

export const GearboxIcon = ({ className = "w-4 h-4" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 3v10M8 3v10M12 3v5M4 8h8" />
  </svg>
);

export const WheelIcon = ({ className = "w-4 h-4" }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="8" cy="8" r="5.5" />
    <circle cx="8" cy="8" r="2" />
  </svg>
);

export const MakeIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M2.5 10.5h11M3.5 10.5l1.5-4h6l1.5 4" />
    <circle cx="5" cy="12" r="1" />
    <circle cx="11" cy="12" r="1" />
  </svg>
);

export const ModelIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="2.5" y="4.5" width="11" height="7" rx="2" />
    <path d="M5.5 8h5" />
  </svg>
);

// Milemark's mark is its own drawing at 16 units: a plan view, nose left, with
// the driven wheels lit. The template's roundel read as another maker's badge.
export const LogoMark = ({ className = "w-6 h-6" }: IconProps) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
    <rect x="1.5" y="4.5" width="13" height="7" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <rect x="2.5" y="2" width="3" height="2" rx="0.8" className="fill-primary-blue" />
    <rect x="2.5" y="12" width="3" height="2" rx="0.8" className="fill-primary-blue" />
  </svg>
);
