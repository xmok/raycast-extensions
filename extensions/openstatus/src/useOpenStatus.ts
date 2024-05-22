import { useFetch } from "@raycast/utils"
import { API_TOKEN, API_URL } from "./constants"

export default function useOpenStatus<T>(endpoint: "monitor" | "incident" | "page" | "status_report", options?: { body?, execute?: boolean, onData? }) {
    try {
        const url = new URL(`v1/${endpoint}`, API_URL);
        const { isLoading, data, revalidate } = useFetch<T>(url.toString(), {
            method: options?.body ? "POST" : "GET",
            headers: {
                "x-openstatus-key": API_TOKEN
            },
            body: options?.body ? JSON.stringify(options.body) : undefined,
            onData(data) {
                options?.onData?.()
                console.log({data})
            },
            onError(error) {
                console.log('onError', error);
            },
            execute: options?.execute
        })
        return { isLoading, data, revalidate };
    } catch (error) {
        console.log({error})
        return { isLoading: false, error }
    }
}