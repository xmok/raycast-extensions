import { getPreferenceValues } from "@raycast/api";
import {
  SuccessResponse,
  ErrorResponse,
  Domain,
  DNSInfo,
  EmailAccount,
  CreateEmailAccountRequest,
  EmailForwarder,
} from "./types";

const { api_key, server, username } = getPreferenceValues<Preferences>();
const API_URL = "https://api.mxroute.com/";
const makeRequest = async <T>(endpoint: string, options?: RequestInit) => {
  const response = await fetch(API_URL + endpoint, {
    method: options?.method,
    headers: {
      "X-Api-Key": api_key,
      "X-Server": server,
      "X-Username": username,
      "Content-Type": "application/json",
    },
    body: options?.body,
  });
  if (response.headers.get("Content-Length") === "0") return undefined as T;
  const result = (await response.json()) as SuccessResponse<string[]> | ErrorResponse;
  if (!result.success) throw new Error(result.error.message);
  return result.data as T;
};

export const mxroute = {
  domains: {
    create: (domain: string) => makeRequest("domains", { method: "POST", body: JSON.stringify({ domain }) }),
    get: (domain: string) => makeRequest<Domain>(`domains/${domain}`),
    list: () => makeRequest<string[]>("domains"),
    accounts: {
      create: (domain: string, values: CreateEmailAccountRequest) =>
        makeRequest(`domains/${domain}/email-accounts`, { method: "POST", body: JSON.stringify(values) }),
      delete: (domain: string, username: string) =>
        makeRequest(`domains/${domain}/email-accounts/${username}`, { method: "DELETE" }),
      list: (domain: string) => makeRequest<EmailAccount[]>(`domains/${domain}/email-accounts`),
    },
    dns: {
      get: (domain: string) => makeRequest<DNSInfo>(`domains/${domain}/dns`),
    },
    forwarders: {
      create: (domain: string, values: CreateEmailAccountRequest) =>
        makeRequest(`domains/${domain}/email-accounts`, { method: "POST", body: JSON.stringify(values) }),
      delete: (domain: string, username: string) =>
        makeRequest(`domains/${domain}/email-accounts/${username}`, { method: "DELETE" }),
      list: (domain: string) => makeRequest<EmailForwarder[]>(`domains/${domain}/forwarders`),
    },
  },
};
