interface AppIconProps {
  size?: number;
  className?: string;
}

export default function AppIcon({ size = 32, className = "" }: AppIconProps) {
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
      <circle
        cx="13.5"
        cy="13.5"
        r="7.25"
        stroke="#fafafa"
        strokeWidth="2.75"
      />
      <path
        d="M19.1 19.1 25.75 25.75"
        stroke="#f59e0b"
        strokeWidth="3.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
