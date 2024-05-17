import { useFetch } from "@raycast/utils";

export default function usePantheon<T>(endpoint: "person" | "place" | "country" | "occupation" | "era", query: { key: string, val: string }) {
    const LIMIT = 50;

    const { isLoading, data, pagination } = useFetch(
        (options) =>
          `https://api.pantheon.world/${endpoint}?` +
        
          new URLSearchParams({ offset: String(options.page * LIMIT), limit: LIMIT.toString() }).toString() + `&${query.key}=ilike.%${query.val}%`,
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