import { ImageResponse } from "next/og";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/site-metadata";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(145deg, #fffbeb 0%, #fafafa 55%, #f4f4f5 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: "#18181b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: "#18181b",
                letterSpacing: "-0.03em",
              }}
            >
              {SITE_NAME}
            </div>
            <div style={{ fontSize: 32, fontWeight: 600, color: "#b45309" }}>
              {SITE_TAGLINE}
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 30,
            lineHeight: 1.45,
            color: "#52525b",
            maxWidth: 900,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size },
  );
}
