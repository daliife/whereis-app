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
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill="#18181b" />
      <rect x="5" y="6" width="22" height="9" rx="2" fill="#3f3f46" />
      <rect x="12" y="9.5" width="8" height="2.5" rx="1.25" fill="#fbbf24" />
      <rect x="5" y="17" width="22" height="9" rx="2" fill="#3f3f46" />
      <rect x="12" y="20.5" width="8" height="2.5" rx="1.25" fill="#52525b" />
    </svg>
  );
}
