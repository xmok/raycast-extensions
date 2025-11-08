import { getPreferenceValues } from "@raycast/api";
import { ErrorResult } from "./types";

export const API_URL = "https://do.featurebase.app/v2";
const {api_key} = getPreferenceValues<Preferences>();
export const API_HEADERS = {
    "X-API-Key": api_key,
        'Content-Type': 'application/json'
}
export const parseFBResponse = async (response: Response) => {
    const result = await response.json();
if (!response.ok) throw new Error((result as ErrorResult).message)
    return result   
}
export const FB_LIMIT = 20