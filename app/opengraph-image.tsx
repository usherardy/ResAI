import { ImageResponse } from "next/og";

export const alt =
  "ResAI: Run your restaurant. Just ask. An AI-native operating system for restaurants.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#1c1a17";
const MUTED = "#6b665f";
const CANVAS = "#faf9f7";
const BRAND = "#e2582f";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CANVAS,
          padding: "72px 80px",
          color: INK,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 13,
              background: INK,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 13px",
              gap: 8,
            }}
          >
            <div style={{ width: 26, height: 5, borderRadius: 3, background: "#fff" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 14, height: 5, borderRadius: 3, background: "#fff" }} />
              <div style={{ width: 7, height: 7, borderRadius: 4, background: BRAND }} />
            </div>
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>ResAI</div>
          <div
            style={{
              marginLeft: 16,
              fontSize: 20,
              color: MUTED,
              border: "1px solid #e4e1dc",
              borderRadius: 999,
              padding: "6px 16px",
              display: "flex",
            }}
          >
            Early access · coming soon
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: MUTED, marginBottom: 18 }}>
            The AI-native operating system for restaurants
          </div>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
            Run your restaurant.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 1.1,
            }}
          >
            Just ask<span style={{ color: BRAND }}>.</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              background: INK,
              color: "#fff",
              fontSize: 24,
              padding: "14px 22px",
              borderRadius: 22,
            }}
          >
            “Change burger prices by 10%.”
          </div>
          <div
            style={{
              display: "flex",
              background: "#fff",
              border: "1px solid #e4e1dc",
              fontSize: 24,
              padding: "14px 22px",
              borderRadius: 22,
              color: MUTED,
            }}
          >
            5 changes ready · Approve?
          </div>
        </div>
      </div>
    ),
    size,
  );
}
