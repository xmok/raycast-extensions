import { getPreferenceValues } from "@raycast/api";
import { SuccessResponse, ErrorResponse } from "./types";

const {api_key, server, username} = getPreferenceValues<Preferences>();
const API_URL = "https://api.mxroute.com/";
export const makeRequest = async<T,>(endpoint: string, options?: RequestInit) => {
  const response = await fetch(API_URL + endpoint, {
    method: options?.method,
    headers: {
      "X-Api-Key": api_key,
      "X-Server": server,
      "X-Username": username,
      "Content-Type": "application/json"
    },
    body: options?.body
  })
  if (response.status===204)  return undefined as T
  const result = await response.json() as SuccessResponse<string[]> | ErrorResponse;
  if (!result.success) throw new Error(result.error.message);
  return result.data as T;
} 