"use client";

import dynamic from "next/dynamic";

interface QRCodeProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  includeMargin?: boolean;
  className?: string;
}

const QRCodeSVG = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeSVG),
  { ssr: false },
);

export default function QRCode({
  size = 100,
  className,
  ...props
}: QRCodeProps) {
  return <QRCodeSVG size={size} className={className} {...props} />;
}
