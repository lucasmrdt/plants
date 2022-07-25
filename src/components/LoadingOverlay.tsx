import { Loading } from "./Loading";

export function LoadingOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        background: "rgba(255, 255, 255, 0.5)",
        zIndex: 0,
        top: 0,
        left: -10,
        right: -10,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loading />
    </div>
  );
}
