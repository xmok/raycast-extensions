import { useFetch } from "@raycast/utils";
import { Endpoint } from "./types";

export default function usePantheon<T>(endpoint: Endpoint, query: { key: string, val: string }) {
    const LIMIT = 50;

    const { isLoading, data, pagination } = useFetch(
        (options) =>
          `https://api.pantheon.world/${endpoint}?` +
        
          new URLSearchParams({ offset: String(options.page * LIMIT), limit: LIMIT.toString() }).toString() + (query.val ? `&${query.key}=fts.${query.val.replaceAll(" ", `%26`)}:*` : ""),
        {
            mapResult(result: T[]) {
            return {
              data: result,
              hasMore: result.length===LIMIT,
            };
          },
          keepPreviousData: true,
          initialData: [],
        },
      );

      return {isLoading, data, pagination};
}