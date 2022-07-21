import { createStore } from "nedux";
import { createStoreHook } from "react-nedux";

export const store = createStore({
  threshold: 0,
  watering: 0,
});

export const useStore = createStoreHook(store);
