import { getPreferenceValues} from "@raycast/api";
import { Account, ErrorResult, PaginatedResult, SuccessResult, User } from "./types";

const {api_token} = getPreferenceValues<Preferences>()
const API_URL = "https://api.infomaniak.com";
const API_HEADERS = {
        Authorization: `Bearer ${api_token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
    }
const makeRequest = async <T>(endpoint: string) => {
  const url = new URL(endpoint, API_URL);
  const response = await fetch(url, {
    headers: API_HEADERS
  });
  const result = await response.json();
  if (!response.ok)
  throw new Error((result as ErrorResult).error.description);
//   let data = result.data;
//   if (url.searchParams.has("page")) {
//     data = data as PaginatedResult<T>;
//     return {
//         data,
//         hasMore: result
//     }
//   }
//   return data;
  return result as T;
};

export const infomaniak = {
  accounts: {
    list: () => makeRequest<SuccessResult<Account[]>>("1/accounts"),
    users: {
        list: (params: {accountId: number, page: number}) => makeRequest<PaginatedResult<User>>(`2/accounts/${params.accountId}/users?page=${params.page}`)
    }
  }
}

