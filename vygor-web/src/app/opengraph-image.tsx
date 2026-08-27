import { ImageResponse } from "next/og";

/**
 * Social share card, rendered at build time.
 *
 * Drawn rather than screenshotted so it stays sharp and can be edited in code.
 * next/og runs a minimal CSS subset — flexbox only, no gap shorthand on some
 * versions, no external assets — so this is written plainly on purpose.
 */

export const alt = "Vygor — eat better, train smarter, lose the weight.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: "72px 80px",
          background: "linear-gradient(125deg, #0079B4 0%, #015E8C 52%, #04506F 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* No radial "glow" blobs here on purpose: Satori interpolates a
            transparent gradient stop through black, so
            `radial-gradient(..., rgba(r,g,b,0))` renders as a dark smudge
            rather than fading out. The flat diagonal gradient is the reliable
            choice — accent colour is carried by the headline and chips. */}

        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            Vygor
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 16,
              paddingLeft: 16,
              borderLeft: "2px solid rgba(255,255,255,0.35)",
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            Health
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
            }}
          >
            Eat better, train smarter,
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              color: "#8BF0EE",
            }}
          >
            lose the weight.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.82)",
              maxWidth: 880,
            }}
          >
A super app for weight management and wellness, with human-driven AI tools.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          {["Meal plans", "Workouts", "Macro tracking", "Contests"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                marginRight: 14,
                padding: "12px 24px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.10)",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
