import { showFailureToast, useFetch } from "@raycast/utils";
import { API_HEADERS, API_URL } from "../constants";
import { ErrorResponse, SuccessResponse } from "../types";

export function useHabitica<T, U=object>(endpoint: string) {
    const { isLoading, data } = useFetch(API_URL + endpoint, {
        headers: API_HEADERS,
        async parseResponse(response) {
            if (!response.ok) {
                const result = await response.json() as ErrorResponse;
                throw new Error(result.message, { cause: result.error })
            }
            const result = await response.json() as (SuccessResponse<T> & U);
            return result;
        },
        async onError(error) {
            await showFailureToast(error.message, { title: String(error.cause) || "Something went wrong" });
        }
    });
    return { isLoading, data };
}