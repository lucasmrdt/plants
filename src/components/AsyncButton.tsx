import { useEffect, useMemo, useState } from "react";
import { Button, ButtonProps } from "primereact/button";
import { usePrev } from "@/hooks";

interface Props extends ButtonProps {}

function AsyncButton({ onClick, label, ...props }: Props) {
  const [showResponse, setShowResponse] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const state = useMemo(
    () => ({ hasData, isLoading, hasError }),
    [hasData, hasError, isLoading]
  );
  const prevState = usePrev(state);

  async function runAction(fct?: (...args: any[]) => any, ...args: any[]) {
    setIsLoading(true);
    try {
      fct && (await fct(...args));
      setHasData(true);
    } catch {
      setHasError(true);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (prevState?.isLoading && !state.isLoading) {
      setShowResponse(true);
      setTimeout(() => setShowResponse(false), 1000);
    }
  }, [prevState?.isLoading, state]);

  return (
    <Button
      onClick={() => runAction(onClick)}
      disabled={state.isLoading || showResponse}
      label={
        state.isLoading
          ? "loading..."
          : showResponse
          ? state.hasError
            ? "Error!"
            : "Ok!"
          : label
      }
      {...props}
    />
  );
}

export default AsyncButton;
