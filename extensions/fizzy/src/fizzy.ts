import { getPreferenceValues } from "@raycast/api";
import { Board, Card, CreateBoardRequest, Notification, User } from "./types";

const { fizzy_url, api_token, account_slug } = getPreferenceValues<Preferences>();

const makeRequest = async<T>(endpoint: string, options?: RequestInit) => {
    const url = new URL(endpoint, fizzy_url);
    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: "application/json",
            ...options?.headers,
            "Authorization": `Bearer ${api_token}`,
        }
    });
    if ([201,204].includes(response.status)) return undefined as T;
    if (response.headers.get("Content-Type")?.includes("text/plain")) throw new Error(await response.text())
    const result = await response.json();
    return result as T;
}

export const fizzy = {
    boards: {
        create: (board: CreateBoardRequest) => makeRequest(`${account_slug}/boards`, { method: "POST", body: JSON.stringify({board}) }),
        delete: (boardId: string) => makeRequest(`${account_slug}/boards/${boardId}`, { method: "DELETE" }),
        list: () => makeRequest<Board[]>(`${account_slug}/boards`)
    },
    cards: {
        list: (boardId: string) => makeRequest<Card[]>(`${account_slug}/cards?board_ids[]=${boardId}`)
    },
    notifications: {
        list: () => makeRequest<Notification[]>(`${account_slug}/notifications`),
        markAsRead: (notificationId: string) => makeRequest(`${account_slug}/notifications/${notificationId}/reading`, { method: "POST" }),
        markAllAsRead: () => makeRequest(`${account_slug}/notifications/bulk_reading`, { method: "POST" }),
        markAsUnread: (notificationId: string) => makeRequest(`${account_slug}/notifications/${notificationId}/reading`, { method: "DELETE" }),
    },
    users: {
        list: () => makeRequest<User[]>(`${account_slug}/users`)
    }
}