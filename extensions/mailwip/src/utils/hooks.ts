import { showToast, Toast } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { API_URL, API_HEADERS } from "./constants";
import { Alias } from "./types";

const headers = API_HEADERS;
async function parseResponse(response: Response) {
    if (!response.ok) {
        const contentType = response.headers.get("Content-Type");
        if (contentType==="text/html" || contentType==="application/json") throw response.statusText;
        const result = await response.json() as ({ errors: string[] } | { status: number; error: string });
        if ("errors" in result) throw result.errors.join(" | ");
        throw result.error;
    }
    const result = await response.json();
    return result;
}
const failureToastOptions = {
    title: "Mailwip Error"
}
const options = { headers, parseResponse, failureToastOptions };

export const useAliases = (domain: string) => useFetch(API_URL + `domains/${domain}/aliases`, {
    ...options,
    mapResult(result: { data: Alias[] }) {
        return {
            data: result.data
        }
    },
    async onData(data) {
        const numOfAliases = data.length;
        await showToast({
          title: "Success",
          message: `Fetched ${numOfAliases} ${numOfAliases === 1 ? "Alias" : "Aliases"}`,
          style: Toast.Style.Success,
        });
    },
    initialData: []
})