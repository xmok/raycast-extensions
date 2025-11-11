import { getApiKeys } from "@immich/sdk";
import { Icon, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { initialize } from "./immich";

export default function APIKeys() {
    const {isLoading,data} = useCachedPromise(async() => {
        initialize();
        const res = await getApiKeys();
        return res;
    });

    return <List isLoading={isLoading}>
        {data?.map(key => <List.Item key={key.id} icon={Icon.Key} title={key.name} subtitle={key.permissions.join()} accessories={[{date: new Date(key.createdAt)}]} />)}
    </List>
}