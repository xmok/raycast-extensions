import { Action, ActionPanel, Form, Icon, List, useNavigation } from "@raycast/api";
import { Monitor, StatusPage } from "./types";
import useOpenStatus from "./useOpenStatus";
import { FormValidation, getFavicon, useForm } from "@raycast/utils";

export default function StatusPages() {
    const { isLoading, data: pages, openstatusUrl, revalidate } = useOpenStatus<StatusPage[]>("page");

    return <List isLoading={isLoading}>
        {pages?.map(page => {
            const viewURL = new URL(page.customDomain || openstatusUrl);
            viewURL.hostname = `${page.slug}.${viewURL.hostname}`;
            
            return <List.Item key={page.id} icon={page.passwordProtected ? Icon.Lock : Icon.LockUnlocked} title={page.title} subtitle={page.slug} accessories={[
                { text: page.description }
            ]} actions={<ActionPanel>
                <Action.OpenInBrowser title="View" icon={page.icon || getFavicon(viewURL, { fallback: Icon.Globe })} url={viewURL.toString()} />
                <Action.Push title="Update Page" icon={Icon.Pencil} target={<UpdatePage page={page} onPageUpdated={revalidate} />} />
            </ActionPanel>} />
        })}
    </List>
}

type UpdatePageProps = {
    page: StatusPage;
    onPageUpdated: () => void;
}
function UpdatePage({ page, onPageUpdated }: UpdatePageProps) {
    const { pop } = useNavigation();

    type FormValues = {
        title: string;
        slug: string;
        description: string;
        monitors: string[];
    }
    const { itemProps, handleSubmit, values } = useForm<FormValues>({
        onSubmit() {
            update?.();
        },
        validation: {
            description: FormValidation.Required
        },
        initialValues: {
            title: page.title,
            slug: page.slug,
            description: page.description,
        }
    });

    const { isLoading: isFetching, data: monitors, openstatusUrl } = useOpenStatus<Monitor[]>("monitor");
    const { isLoading: isUpdating, revalidate: update } = useOpenStatus<StatusPage>(`page/${page.id}`, {
        method: "PUT",
        body: {
            id: page.id,
            ...values,
            slug: values.slug===page.slug ? undefined : values.slug
        },
        execute: false,
        onData() {
            onPageUpdated();
            pop();
        }
    });
    const isLoading = isFetching || isUpdating;

    return <Form navigationTitle="Update Status Page" isLoading={isLoading} actions={<ActionPanel>
        <Action.SubmitForm title="Submit" icon={Icon.Check} onSubmit={handleSubmit} />
    </ActionPanel>}>
        <Form.Description title="ID" text={page.id.toString()} />
        <Form.Separator />
        <Form.Description title="Basic information" text="The public status page to update your users on service uptime" />
        <Form.TextField title="Title" placeholder="Documenso Status" info="The title of your page" {...itemProps.title} />
        <Form.TextField title="Slug" placeholder="documenso" info="The subdomain for your status page. At least 3 chars" {...itemProps.slug} />
        <Form.Description text={`.${openstatusUrl?.hostname}`} />
        
        <Form.Separator />
        <Form.Description title="Connected Monitors" text="Select the monitors you want to display on your status page. Change the order by using the right-side handle. Inactive monitors will not be shown" />
        <Form.TagPicker title="Monitors" placeholder="Select monitors" {...itemProps.monitors}>
            {monitors?.filter(monitor => monitor.active).map(monitor => <Form.TagPicker.Item key={monitor.id} title={monitor.name || ""} value={monitor.id.toString()} />)}
        </Form.TagPicker>

        <Form.Separator />
        <Form.Description title="Advanced" text="Provide informations about what your status page is for. A favicon can be uploaded to customize your status page. It will be used as an icon on the header as well" />
        <Form.TextField title="Description" placeholder="Stay informed about our api and website health" info="Provide your users information about it" {...itemProps.description} />
        {/* icon */}
        {/* custoDomain */}
    </Form>
}