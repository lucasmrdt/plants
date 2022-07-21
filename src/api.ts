import { parseCSV } from "./utils";
import { API_URL, AVAILABLE_IDS } from "./constants";
import dayjs from "dayjs";
import { store } from "./store";

async function parseResponse(response: Response) {
  if (response.status !== 200) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  const content = await response.text();
  return parseCSV(content).map(([timestamp, value]) => ({
    timestamp: timestamp * 1000,
    value,
  }));
}

async function parseAndFilterResponse(
  response: Response,
  start: number,
  end?: number
) {
  const _start = dayjs(start).startOf("day").valueOf();
  const _end = dayjs(end ?? start)
    .endOf("day")
    .valueOf();
  return (await parseResponse(response)).filter(
    ({ timestamp }) => timestamp >= _start && timestamp <= _end
  );
}

export async function fetchMoistureData(
  ids: string[],
  start: number,
  end?: number
) {
  return Promise.all(
    ids.map(async (id) => {
      console.log(id);
      const response = await fetch(`${API_URL}/${id}/moisture.dat`);
      return parseAndFilterResponse(response, start, end);
    })
  );
}

export async function fetchTemperatureData(
  ids: string[],
  start: number,
  end?: number
) {
  return Promise.all(
    ids.map(async (id) => {
      const response = await fetch(`${API_URL}/${id}/temperature.dat`);
      return parseAndFilterResponse(response, start, end);
    })
  );
}

export async function fetchOutsideHumidityData(start: number, end?: number) {
  const response = await fetch(`${API_URL}/weather_api/outside_humidity.dat`);
  return parseAndFilterResponse(response, start, end);
}

export async function fetchOutsideTemperatureData(start: number, end?: number) {
  const response = await fetch(
    `${API_URL}/weather_api/outside_temperature.dat`
  );
  return parseAndFilterResponse(response, start, end);
}

export async function fetchThresholdData() {
  const response = await fetch(`${API_URL}/${AVAILABLE_IDS[0]}/threshold.dat`);
  const result = await parseResponse(response);
  store.set("threshold", result[result.length - 1].value);
  return result;
}

export async function fetchWateringDurationData() {
  const response = await fetch(`${API_URL}/${AVAILABLE_IDS[0]}/watering.dat`);
  const result = await parseResponse(response);
  store.set("watering", result[result.length - 1].value);
  return result;
}

export async function fetchOutsidePressureData(start: number, end?: number) {
  const response = await fetch(`${API_URL}/weather_api/outside_pressure.dat`);
  return parseAndFilterResponse(response, start, end);
}
