import { useFetch } from "@raycast/utils";
import { generateApiWorkspaceUrl } from "./utils";
import { getPreferenceValues } from "@raycast/api";
import { PaginatedResult } from "./types";

export function usePlanePaginated<T>(endpoint: string) {
    const url = generateApiWorkspaceUrl();
    const { api_key } = getPreferenceValues<Preferences>();

    const { isLoading, data, pagination } = useFetch(
        (options) =>
            url + "/" + endpoint + `?per_page=20` + (options.cursor ? `&cursor=${options.cursor}` : ""), {
        headers: {
            "X-Api-Key": api_key
        },  
        mapResult(result: PaginatedResult<T>) {
            return {
                data: result.results,
                hasMore: result.next_page_results,
                cursor: result.next_cursor
            }
        },
        initialData: [],
        keepPreviousData: true
    });
    return { isLoading, data, pagination };
}