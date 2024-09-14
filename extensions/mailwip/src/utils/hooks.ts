import { showToast, Toast } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { API_URL, API_HEADERS } from "./constants";
import { Alias, ErrorResponse } from "./types";
import { Response as NodeFetchResponse } from "node-fetch";

const headers = API_HEADERS;
export async function parseResponse(response: Response | NodeFetchResponse) {
    if (!response.ok) {
        const contentType = response.headers.get("Content-Type");
        
        // application/json returns empty whereas 'application/json; charset=utf-8' has json
        if (contentType==="text/html" || contentType==="application/json") throw response.statusText;

        const result = await response.json() as ErrorResponse;
        if ("errors" in result) throw Array.from(result.errors).join(" | ");
        if ("message" in result) throw result.message;
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
});
export const useEmails = (domain: string, status: string, limit: string) => useFetch(API_URL + `mails?` + new URLSearchParams({ status, limit }).toString() + (domain==="all" ? "" : `domain=${domain}`), {
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
          message: `Fetched ${numOfAliases} ${numOfAliases === 1 ? "email" : "emails"}`,
          style: Toast.Style.Success,
        });
    },
    initialData: []
});