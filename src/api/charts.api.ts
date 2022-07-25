import dayjs from "dayjs";
import { parseCSV } from "@/utils";
import { API_URL, AVAILABLE_IDS } from "@/constants";
import { TimeRange } from "@/types";

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

export async function fetchMoistureData(id: string, { start, end }: TimeRange) {
  const response = await fetch(`${API_URL}/${id}/moisture.dat`);
  return parseAndFilterResponse(response, start, end);
}

export async function fetchTemperatureData(
  id: string,
  { start, end }: TimeRange
) {
  const response = await fetch(`${API_URL}/${id}/temperature.dat`);
  return parseAndFilterResponse(response, start, end);
}

export async function fetchOutsideHumidityData({ start, end }: TimeRange) {
  const response = await fetch(`${API_URL}/weather_api/outside_humidity.dat`);
  return parseAndFilterResponse(response, start, end);
}

export async function fetchOutsideTemperatureData({ start, end }: TimeRange) {
  const response = await fetch(
    `${API_URL}/weather_api/outside_temperature.dat`
  );
  return parseAndFilterResponse(response, start, end);
}

export async function fetchOutsidePressureData({ start, end }: TimeRange) {
  const response = await fetch(`${API_URL}/weather_api/outside_pressure.dat`);
  return parseAndFilterResponse(response, start, end);
}

export async function fetchThresholdData() {
  const response = await fetch(`${API_URL}/${AVAILABLE_IDS[0]}/threshold.dat`);
  const result = await parseResponse(response);
  return result;
}

export async function fetchWateringDurationData() {
  const response = await fetch(`${API_URL}/${AVAILABLE_IDS[0]}/watering.dat`);
  const result = await parseResponse(response);
  return result;
}
