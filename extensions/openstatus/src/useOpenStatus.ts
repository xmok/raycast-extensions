import { useFetch } from "@raycast/utils"
import { API_TOKEN, API_URL } from "./constants"

export default function useOpenStatus<T>(endpoint: "monitor" | "incident" | "page") {
    try {
        const url = new URL(`v1/${endpoint}`, API_URL);
        const { isLoading, data } = useFetch<T>(url.toString(), {
            method: "GET",
            headers: {
                "x-openstatus-key": API_TOKEN
            },
            onData(data) {
                console.log({data})
            },
        })
        return { isLoading, data };
    } catch (error) {
        console.log({error})
        return { isLoading: false, error }
    }
}