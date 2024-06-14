import { showFailureToast, useFetch } from "@raycast/utils"
import { API_HEADERS, OPENSTATUS_URL } from "./constants"
import { ErrorResponse } from "./types";

// export default function useOpenStatus<T>(endpoint: "monitor" | "incident" | "page" | "status_report", options?: { method?: "GET" | "POST" | "PUT", body?, execute?: boolean, onData? }) {
export default function useOpenStatus<T>(endpoint: string, options?: { method?: "GET" | "POST" | "PUT", body?, execute?: boolean, onData? }) {
    try {
        // This is the main reason for the hook as we need to make sure API URL is valid
        
        const openstatusUrl = new URL(OPENSTATUS_URL); // ensure the URL is valid; we will also return this URL so that other commands get access to a valid OpenStatus URL
        const url = new URL(openstatusUrl);
        url.hostname = `api.${url.hostname}`; // use API subdomain
        url.pathname = `v1/${endpoint}`; // append the api paths
        // console.log({
        //     url, method: (options?.method) || (options?.body ? "POST" : "GET"), body: options?.body ? JSON.stringify(options.body) : undefined
        // })
        const { isLoading, data, revalidate } = useFetch<T>(url.toString(), {
            method: (options?.method) || "GET",
            headers: API_HEADERS,
            body: options?.body ? JSON.stringify(options.body) : undefined,
            onData(data) {
                options?.onData?.()
                console.log({data})
            },
            async parseResponse(response) {
                if (!response.ok) {
                    if (response.headers.get("Content-Type")?.includes("text/plain")) {
                        const result = await response.text();
                        throw new Error(result);
                    } else {
                        const result = await response.json() as ErrorResponse;
                        throw({
                            name: result.code,
                            message: result.message
                        });
                    }
                }
            
                const result = await response.json();
                return result;
            },
            // async onError(error) {
            //     await showFailureToast(error.message, { title: error.name });
            // },
            execute: options?.execute
        })
        return { isLoading, data, revalidate, openstatusUrl };
    } catch (error) {
            showFailureToast(error);
            return { isLoading: false, error }
    }
}