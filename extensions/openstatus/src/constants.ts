import { getPreferenceValues } from "@raycast/api"

export const OPENSTATUS_URL = getPreferenceValues<Preferences>().openstatus_url;
const API_TOKEN = getPreferenceValues<Preferences>().api_token;
export const API_HEADERS = {
    "Content-Type": "application/json",
    "x-openstatus-key": API_TOKEN
}