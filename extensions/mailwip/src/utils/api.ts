import { Toast, showToast } from "@raycast/api";
import {
  BodyRequest,
  ErrorResponse,
  Alias,
  AliasCreate,
  APIMethod,
  AliasCreateResponse,
  Email,
  DomainDelete,
} from "./types";
import fetch from "node-fetch";
import { API_HEADERS, API_URL } from "./constants";
import { parseResponse } from "./hooks";
import { showFailureToast } from "@raycast/utils";

const callApi2 = async <T>(endpoint: string, method: APIMethod, body?: BodyRequest) => {
  const response = await fetch(API_URL + endpoint, {
    method,
    headers: API_HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await parseResponse(response);
  return result as T;
};

const callApi = async (endpoint: string, method: APIMethod, body?: BodyRequest, animatedToastMessage = "") => {
  await showToast(Toast.Style.Animated, "Processing...", animatedToastMessage);
  try {
    let apiResponse;
    if (body) {
      apiResponse = await fetch(API_URL + endpoint, {
        method,
        headers: API_HEADERS,
        body: JSON.stringify(body),
      });
    } else {
      apiResponse = await fetch(API_URL + endpoint, {
        method,
        headers: API_HEADERS,
      });
    }

    if (!apiResponse.ok) {
      const contentType = apiResponse.headers.get("content-type");
      const { status, statusText } = apiResponse;
      const error = `${status} Error`;

      const toast = await showFailureToast(undefined, { title: error });
      if (contentType?.includes("application/json")) {
        const jsonResponse = (await apiResponse.json()) as { message: string } | { errors: string[] };
        if ("errors" in jsonResponse) {
          const message = jsonResponse.errors.join(" | ");
          toast.message = message;
          return { errors: message };
        } else {
          toast.message = jsonResponse.message;
          return { errors: jsonResponse.message };
        }
      } else {
        toast.message = statusText;
        return { errors: statusText };
      }
    }

    const response = await apiResponse.json();
    await showToast(Toast.Style.Success, `Success`);
    return response;
  } catch (err) {
    console.log(err);
    const error = "Failed to execute request. Please try again later.";
    await showToast(Toast.Style.Failure, `Error`, error);
    return { error };
  }
};

// DOMAINS
export async function deleteDomains({ domains }: DomainDelete) {
  return (await callApi2<{ message: string }>(
    `domains/batch/`,
    "DELETE",
    { domains },
  ));
}

// ALIASES
export async function getDomainAliases(domain: string) {
  return (await callApi(`domains/${domain}/aliases`, "GET", undefined, "Fetching Aliases")) as
    | ErrorResponse
    | { data: Alias[] };
}
export async function createDomainAlias(domain: string, newAlias: AliasCreate) {
  return (await callApi2<AliasCreateResponse>(`domains/${domain}/aliases`, "POST", newAlias));
}
export async function deleteDomainAlias(domain: string, alias: Alias) {
  return (await callApi2<{ data: { success: true } }>(`domains/${domain}/aliases/`, "DELETE", alias));
}
// EMAILS
export async function getEmails(domain: string, status: string, limit: number) {
  const searchParams = new URLSearchParams({ status, limit: limit.toString() });
  if (domain!=="all") searchParams.append("domain", domain);
  const result = await callApi2<{ data: Email[] }>(`mails?${searchParams}`, "GET");
  return result.data;
}
