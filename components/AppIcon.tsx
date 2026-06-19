interface AppIconProps {
  size?: number;
  className?: string;
}

export default function AppIcon({ size = 28, className = "" }: AppIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#18181b" />
      <circle cx="13.5" cy="13.5" r="5.75" stroke="#e4e4e7" strokeWidth="2" />
      <path
        d="M17.75 17.75 22.25 22.25"
        stroke="#fbbf24"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="13.5" cy="13.5" r="1.75" fill="#fbbf24" />
    </svg>
  );
}
