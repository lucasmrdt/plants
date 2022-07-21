export function Loader() {
  return (
    <div
      style={{
        position: "absolute",
        background: "rgba(255, 255, 255, 0.5)",
        zIndex: 1,
        top: 0,
        left: -10,
        right: -10,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <i className="pi pi-spin pi-spinner" style={{ fontSize: "2em" }}></i>
    </div>
  );
}
