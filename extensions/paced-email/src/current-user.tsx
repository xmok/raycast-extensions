import { useFetch } from "@raycast/utils";
import { API_HEADERS, API_URL } from "./constants";
import { Action, ActionPanel, Detail } from "@raycast/api";
import { User } from "./types";
import ErrorComponent from "./components/ErrorComponent";

export default function CurrentUser() {
    const { isLoading, data, error } = useFetch<User>(API_URL + "me", { headers: API_HEADERS });

    const markdown = data ? `## ID: ${data.id}
    
## Email: [${data.email}](mailto:${data.email})

## Time Zone: ${data.time_zone}` : "";

    return error ? <ErrorComponent error={error} /> : <Detail isLoading={isLoading} markdown={markdown} actions={!data ? undefined : <ActionPanel>
        <Action.CopyToClipboard title="Copy ID to Clipboard" content={data.id} />
        <Action.CopyToClipboard title="Copy Email to Clipboard" content={data.email} />
        <Action.CopyToClipboard title="Copy Time Zone to Clipboard" content={data.time_zone} />
    </ActionPanel>} />
}