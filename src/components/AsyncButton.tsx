import { useEffect, useRef, useState } from "react";
import { Button, ButtonProps } from "primereact/button";
import { Status } from "../types";

interface Props extends ButtonProps {}

function AsyncButton({ onClick, label, ...props }: Props) {
  const [showResponse, setShowResponse] = useState(false);
  const [status, setStatus] = useState<Status>("default");
  const prevStatus = useRef(status);

  async function runAction(fct?: (...args: any[]) => any, ...args: any[]) {
    setStatus("loading");
    try {
      fct && (await fct(...args));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    if (prevStatus.current === "loading" && status !== "loading") {
      setShowResponse(true);
      setTimeout(() => setShowResponse(false), 1000);
    }
    prevStatus.current = status;
  }, [status]);

  return (
    <Button
      onClick={() => runAction(onClick)}
      disabled={status === "loading" || showResponse}
      label={
        status === "loading"
          ? "loading..."
          : showResponse
          ? status === "success"
            ? "OK!"
            : "Error!"
          : label
      }
      {...props}
    />
  );
}

export default AsyncButton;
