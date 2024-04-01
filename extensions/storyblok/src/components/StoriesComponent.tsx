import { ISbStoryData } from "storyblok-js-client";
import useStoryblok from "../hooks/useStoryblok";
import { ActionPanel, Color, Icon, List, Toast, showToast } from "@raycast/api";
import ErrorComponent from "./ErrorComponent";
import ListDetailMetadataComponent from "./ListDetailMetadataComponent";

type StoriesComponentProps = {
    space_id: number;
}
export default function StoriesComponent({ space_id }: StoriesComponentProps) {
    const { data, error, isLoading, revalidate } = useStoryblok<{ stories: ISbStoryData[] }>("GET", `/spaces/${space_id}/stories/`, {
        story_only: true
    }, `Fetching Stories in Space ${space_id}`, {
        onData(data) {
            showToast({
                title: "SUCCESS",
                message: `Fetched ${data.stories.length} stories`,
                style: Toast.Style.Success
            })
        },
    });

    return error ? <ErrorComponent error={error} /> : <List navigationTitle="Stories" isLoading={isLoading} isShowingDetail>
        {data?.stories.map(story => <List.Item key={story.id} title={story.name} icon={{ source: Icon.Book, tintColor: story.published ? Color.Green : Color.Yellow }} accessories={[ { date: new Date(story.updated_at) } ]} detail={<List.Item.Detail metadata={<ListDetailMetadataComponent data={story} />} />} actions={<ActionPanel>
                {/* <Action.Push title="Update Space" icon={Icon.Pencil} target={<UpdateSpace space={space} onSpaceUpdated={revalidate} />} /> */}
            </ActionPanel>} />)}
    </List>
}