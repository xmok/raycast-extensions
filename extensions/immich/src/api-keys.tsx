import { ApiKeyResponseDto, deleteApiKey, getApiKeys } from "@immich/sdk";
import { Action, ActionPanel, Alert, confirmAlert, Icon, List, showToast, Toast } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { initialize } from "./immich";

export default function APIKeys() {
    const {isLoading,data, mutate} = useCachedPromise(async() => {
        initialize();
        const res = await getApiKeys();
        return res;
    },[],{initialData: []});

    const confirmAndDelete = async (key: ApiKeyResponseDto) => {
        await confirmAlert({
            icon: "immich_new.png",
            title: "Confirm",
            message: "Are you sure you want to delete this API key?",
            primaryAction: {
                style: Alert.ActionStyle.Destructive,
                title: "Delete",
                async onAction() {
                    const toast = await showToast(Toast.Style.Animated, "Deleting", key.name)
                    try {
                        await mutate(
                            deleteApiKey({id: key.id}), {
                                optimisticUpdate(data) {
                                    return data.filter(k => k.id!==key.id)
                                },
                                shouldRevalidateAfter: false
                            }
                        )
                        toast.style = Toast.Style.Success;
                        toast.title = "Deleted"
                    } catch (error) {
                        
                        toast.style = Toast.Style.Failure;
                        toast.title = "Failed"
                        toast.message = `${error}`
                    }
                },
            }
        })
    }

    return <List isLoading={isLoading}>
        {data.map(key => <List.Item key={key.id} icon={Icon.Key} title={key.name} subtitle={key.permissions.join()} accessories={[{date: new Date(key.createdAt)}]} actions={<ActionPanel>
            <Action icon={Icon.Trash} title="Delete API Key" onAction={() => confirmAndDelete(key)} style={Action.Style.Destructive} />
        </ActionPanel>} />)}
    </List>
}