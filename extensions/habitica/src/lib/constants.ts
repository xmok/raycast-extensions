import { getPreferenceValues } from "@raycast/api";

export const API_URL = "https://habitica.com/api/v3/";
const { user_id, api_key } = getPreferenceValues<Preferences>();

const XMOK_USER_ID = "30db70bf-908b-4639-a413-fdc43bc2f6dc";
// Headers as per https://habitica.fandom.com/wiki/Application_Programming_Interface#Using_the_API
export const API_HEADERS = {
    "Content-Type": "application/json",
    "x-api-user": user_id,
    "x-api-key": api_key,
    "x-client": `${XMOK_USER_ID}-HabiticaRaycastExtension`
}