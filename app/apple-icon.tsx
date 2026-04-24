import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleTouchIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0d9488 0%, #0891b2 100%)",
            width: "100%",
            height: "100%",
            borderRadius: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 40px rgba(13, 148, 136, 0.3)",
          }}
        >
          <div
             style={{
               width: "60%",
               height: "15%",
               background: "white",
               borderRadius: "10px",
               position: "absolute",
             }}
          />
          <div
             style={{
               width: "15%",
               height: "60%",
               background: "white",
               borderRadius: "10px",
               position: "absolute",
             }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
