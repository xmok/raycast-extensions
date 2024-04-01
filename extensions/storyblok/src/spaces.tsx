import { Action, ActionPanel, Form, Icon, List, Toast, showToast, useNavigation } from "@raycast/api";
import useStoryblok from "./hooks/useStoryblok";
import { StoryblokSpace, StoryblokUpdateSpaceFormValues, StoryblokUpdateSpaceRequest } from "./types";
import ErrorComponent from "./components/ErrorComponent";
import ListDetailMetadataComponent from "./components/ListDetailMetadataComponent";
import { useForm } from "@raycast/utils";
import StoriesComponent from "./components/StoriesComponent";

export default function Spaces() {
    const { data, error, isLoading, revalidate } = useStoryblok<{ spaces: StoryblokSpace[] }>("GET", '/spaces/', {}, 'Fetching Spaces', {
        onData(data) {
            showToast({
                title: "SUCCESS",
                message: `Fetched ${data.spaces.length} spaces`,
                style: Toast.Style.Success
            })
        },
    });

    return error ? <ErrorComponent error={error} /> : <List isLoading={isLoading} isShowingDetail>
        {data?.spaces.map(space => <List.Item key={space.id} title={space.name} accessories={[ { date: new Date(space.updated_at) } ]} detail={<List.Item.Detail metadata={<ListDetailMetadataComponent data={space} />} />} actions={<ActionPanel>
            <Action.Push title="Update Space" icon={Icon.Pencil} target={<UpdateSpace space={space} onSpaceUpdated={revalidate} />} />
            <ActionPanel.Submenu title="Go To" icon={Icon.ArrowRight}>
                <Action.Push title="Stories" target={<StoriesComponent space_id={space.id} />} />
            </ActionPanel.Submenu>
        </ActionPanel>} />)}
    </List>
}

type UpdateSpaceProps = {
    space: StoryblokSpace;
    onSpaceUpdated: () => void;
}
function UpdateSpace({ space, onSpaceUpdated }: UpdateSpaceProps) {
    const { pop } = useNavigation();
    
  const { handleSubmit, itemProps } = useForm<StoryblokUpdateSpaceFormValues>({
        onSubmit(values) {
            const newSpace: StoryblokUpdateSpaceRequest = {
                name: values.name || space.name,
                id: !values.id ? space.id : Number(values.id),
                duplicatable: values.duplicatable
            };
            if (values.domain) newSpace.domain = values.domain;
            if (values.uniq_domain) newSpace.uniq_domain = values.uniq_domain;
            if (values.owner_id) newSpace.owner_id = Number(values.owner_id);
            if (values.parent_id) newSpace.parent_id = Number(values.parent_id);
            revalidate({
                space: newSpace
            });
        },
        validation: {
            id(value) {
                if (value && !Number(value))
                    return "The item must be a number";
            },
            owner_id(value) {
                if (value && !Number(value))
                    return "The item must be a number";
            },
            parent_id(value) {
                if (value && !Number(value))
                    return "The item must be a number";
            },
        },
        initialValues: {
            name: space.name,
            domain: space.domain,
            uniq_domain: space.uniq_domain,
            id: space.id.toString(),
            owner_id: space.owner_id.toString(),
            // story_published_hook: space.story_published_hook,
            parent_id: space.parent_id?.toString(),
            duplicatable: space.duplicatable,
            // default_root: space.default_root,
        }
      });

      const { isLoading, error, revalidate } = useStoryblok<{ space: StoryblokSpace }>("PUT", `/spaces/${space.id}`, {}, 'Updating Space', {
        manual: true,
        onData() {
            showToast({
                title: "SUCCESS",
                message: `Updated Space`,
                style: Toast.Style.Success
            });
            onSpaceUpdated();
            pop();
        }
    });
    
    return error ? <ErrorComponent error={error} /> : <Form navigationTitle="Update Space" isLoading={isLoading} actions={<ActionPanel>
        <Action.SubmitForm title="Update" icon={Icon.Check} onSubmit={handleSubmit} />
    </ActionPanel>}>
        <Form.Description title="Initial Name" text={space.name} />
        <Form.Description title="Initial ID" text={space.id.toString()} />
        <Form.Separator />
        
        <Form.TextField title="Name" {...itemProps.name} />       
        <Form.TextField title="Domain" {...itemProps.domain} />
        <Form.TextField title="Unique Domain" {...itemProps.uniq_domain} />
        <Form.TextField title="ID" {...itemProps.id} />
        <Form.TextField title="Owner ID" {...itemProps.owner_id} />
        {/* <Form.TextField title="story_published_hook" {...itemProps.story_published_hook} /> */}
        <Form.TextField title="Parent ID" {...itemProps.parent_id} />
        {/* <Form.TextField title="searchblok_id" {...itemProps.searchblok_id} /> */}
        <Form.Checkbox label="Duplicatable" {...itemProps.duplicatable} />
        {/* <Form.TextField title="Default Root" {...itemProps.default_root} /> */}
    </Form>
}