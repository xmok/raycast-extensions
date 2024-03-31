import { List, Toast, showToast } from "@raycast/api";
import useStoryblok from "./hooks/useStoryblok";
import { StoryblokSpace } from "./types";
import ErrorComponent from "./components/ErrorComponent";
import ListDetailMetadataComponent from "./components/ListDetailMetadataComponent";

export default function Spaces() {
    const { data, error, isLoading } = useStoryblok<{ spaces: StoryblokSpace[] }>('/spaces/', 'Fetching Spaces', {
        onData(data) {
            showToast({
                title: "SUCCESS",
                message: `Fetched ${data.spaces.length} spaces`,
                style: Toast.Style.Success
            })
        },
    });

    return error ? <ErrorComponent error={error} /> : <List isLoading={isLoading} isShowingDetail>
        {data?.spaces.map(space => <List.Item key={space.id} title={space.name} accessories={[ { date: new Date(space.updated_at) } ]} detail={<List.Item.Detail metadata={<ListDetailMetadataComponent data={space} />} />} />)}
    </List>
}