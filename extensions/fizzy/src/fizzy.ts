import { getPreferenceValues } from "@raycast/api";
import { Board, CreateBoardRequest } from "./types";

const { fizzy_url, api_token, account_slug } = getPreferenceValues<Preferences>();

const makeRequest = async<T>(endpoint: string, options?: RequestInit) => {
    const url = new URL(endpoint, fizzy_url);
    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${api_token}`,
        },
        body: options?.body
    });
    if (response.status===201) return undefined as T;
    if (response.headers.get("Content-Type")?.includes("text/plain")) throw new Error(await response.text())
    const result = await response.json();
    return result as T;
}

export const fizzy = {
    boards: {
        create: (board: CreateBoardRequest) => makeRequest(`${account_slug}/boards`, { method: "POST", body: JSON.stringify({board}) }),
        list: () => makeRequest<Board[]>(`${account_slug}/boards`)
    }
}