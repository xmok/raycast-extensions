import { init } from "@immich/sdk";
import { getPreferenceValues } from "@raycast/api";

const {base_url, api_key} = getPreferenceValues<Preferences>();

export const initialize = () => init({ baseUrl: new URL("api", base_url).toString(), apiKey: api_key });