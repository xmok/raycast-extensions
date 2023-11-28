import { getPreferenceValues } from "@raycast/api";

export const API_URL = "https://www.paced.email/api/v1/";

const API_TOKEN = getPreferenceValues<Preferences>().api_token;
export const API_HEADERS = {
    Authorization: `Bearer ${API_TOKEN}`
}

export const PERIODICITIES = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly"
};
export const DIGEST_FORMATS = {
    full: "Full",
    summary: "Basic summary"
}