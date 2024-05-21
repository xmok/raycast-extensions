import { getPreferenceValues } from "@raycast/api"

export const API_URL = getPreferenceValues<Preferences>().api_url;
export const API_TOKEN = getPreferenceValues<Preferences>().api_token;