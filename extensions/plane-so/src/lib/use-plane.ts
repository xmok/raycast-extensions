import { showFailureToast, useFetch } from "@raycast/utils";
import { generateApiWorkspaceUrl } from "./utils";
import { getPreferenceValues } from "@raycast/api";
import { PaginatedResult } from "./types";

const { api_key } = getPreferenceValues<Preferences>();
const headers = {
  "X-Api-Key": api_key,
  "Content-Type": "application/json",
};

type Errors = { [key: string]: string[] };

type UsePlane<T> = {
  method: string;
  body: { [key: string]: string | string[] };
  execute: boolean;
  onData: (data: T) => void;
  onError: (error: { message: string; cause?: Errors }) => void;
};
export function usePlane<T>(endpoint: string, { method = "POST", body, execute, onData, onError }: UsePlane<T>) {
  const url = generateApiWorkspaceUrl();
  // The API seems to have trouble if there isn't an explicit '/' at the end so we ensure
  const _endpoint = endpoint.endsWith("/") ? endpoint : `${endpoint}/`;
  const { isLoading, data } = useFetch<T>(url + _endpoint, {
    method,
    headers,
    body: JSON.stringify(body),
    execute,
    onData,
    async parseResponse(response) {
      const result = await response.json();
      if (!response.ok) {
        if ("error" in result) throw new Error(result.error);
        const errors = result as Errors;
        throw new Error(response.statusText, {
          cause: errors,
        });
      }
      return result;
    },
    async onError(error) {
      await showFailureToast(error, {
        title: "ERROR",
      });

      const cause = error.cause ? (error.cause as Errors) : undefined;
      onError({
        message: error.message,
        cause,
      });
    },
  });
  return { isLoading, data };
}

type UsePlanePaginated = {
  expand?: string[];
  fields?: string[];
};
export function usePlanePaginated<T>(endpoint: string, { expand = [], fields = [] }: UsePlanePaginated = {}) {
  const url = generateApiWorkspaceUrl();

  const { isLoading, data, pagination, revalidate } = useFetch(
    (options) =>
      url +
      endpoint +
      "?" +
      new URLSearchParams({ per_page: "20", expand: expand.join(), fields: fields.join() }).toString() +
      (options.cursor ? `&cursor=${options.cursor}` : ""),
    {
      headers,
      mapResult(result: PaginatedResult<T>) {
        return {
          data: result.results,
          hasMore: result.next_page_results,
          cursor: result.next_cursor,
        };
      },
      initialData: [],
      keepPreviousData: true,
    },
  );
  return { isLoading, data, pagination, revalidate };
}
