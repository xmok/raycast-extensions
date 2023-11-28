import { getAvatarIcon, showFailureToast, useFetch, useForm } from "@raycast/utils";
import { API_HEADERS, API_URL, DIGEST_FORMATS, PERIODICITIES } from "./constants";
import { Action, ActionPanel, Alert, Color, Form, Icon, List, Toast, confirmAlert, showToast } from "@raycast/api";
import { AccountsResponse, CreateInboxFormValues, InboxesResponse, MultiErrorResponse, Periodicity, SingleErrorResponse } from "./types";
import { useState } from "react";
import fetch from "node-fetch";

export default function AccountsAndInboxes() {
    const [page, setPage] = useState(1);
    const { isLoading, data } = useFetch<AccountsResponse>(API_URL + `accounts?page=${page}`, { headers: API_HEADERS });

    return <List isLoading={isLoading} searchBarPlaceholder="Search account" isShowingDetail>
        {data && <List.Section title={`page: ${data.metadata.current_page} of ${data.metadata.total_pages} | per_page: ${data.metadata.per_page} | total_entries: ${data.metadata.total_entries}`}>
        {data.entries.map(account => <List.Item key={account.id} title={account.name} icon={account.avatar_path || getAvatarIcon(account.name)} actions={<ActionPanel>
            <Action.Push title="List Inboxes" icon={Icon.Envelope} target={<ListInboxes account_id={account.id} />} />
            <Action.CopyToClipboard title="Copy Account as JSON" content={JSON.stringify(account)} />
            {data.metadata.current_page < data.metadata.total_pages && <Action title="Fetch Next Page" icon={Icon.ArrowRight} onAction={() => setPage(data.metadata.current_page+1)} />}
            {data.metadata.current_page > 1 && <Action title="Fetch Previous Page" icon={Icon.ArrowLeft} onAction={() => setPage(data.metadata.current_page-1)} />}
        </ActionPanel>} detail={<List.Item.Detail metadata={<List.Item.Detail.Metadata>
            <List.Item.Detail.Metadata.Label title="ID" text={account.id} />
            <List.Item.Detail.Metadata.Label title="Name" text={account.name} />
            <List.Item.Detail.Metadata.Label title="Avatar" text={account.avatar_path || undefined} icon={account.avatar_path || Icon.Minus} />
            <List.Item.Detail.Metadata.Label title="Subscribed" icon={account.subscribed ? Icon.Check : Icon.Multiply} />
            <List.Item.Detail.Metadata.Label title="Plan" text={account.plan} />
        </List.Item.Detail.Metadata>} />} />)}
        </List.Section>}
    </List>
}

type ListInboxesProps = {
    account_id: string;
}
function ListInboxes({ account_id }: ListInboxesProps) {
    const [page, setPage] = useState(1);
    const [isDeleting, setIsDeleting] = useState(false);
    const { isLoading, data, revalidate } = useFetch<InboxesResponse>(API_URL + `inboxes?account_id=${account_id}&page=${page}`, { headers: API_HEADERS });

    function getPeriodicityColor(periodicity: Periodicity) {
        if (periodicity==="daily") return Color.Purple;
        else if (periodicity==="weekly") return Color.Green;
        else if (periodicity==="monthly") return Color.Yellow;
    }

    async function confirmAndDeleteInbox(inbox_id: string) {
        if (
          await confirmAlert({
            title: `Delete inbox '${inbox_id}'?`,
            message: "This action cannot be undone.",
            icon: { source: Icon.DeleteDocument, tintColor: Color.Red },
            primaryAction: { title: "Delete", style: Alert.ActionStyle.Destructive },
          })
        ) {
            setIsDeleting(true);
            await showToast({ title: "Deleting inbox", style: Toast.Style.Animated });
            const apiResponse = await fetch(API_URL + `inboxes/${inbox_id}?account_id=${account_id}`, { headers: API_HEADERS, method: "DELETE" });
            const response = await apiResponse.json() as SingleErrorResponse | { inbox_id: string };
            if ("error" in response) {
                await showFailureToast(response.error);
            } else {
                await showToast({ title: "Inbox Deleted", message: inbox_id });
                revalidate();
            } 
            setIsDeleting(false);
        }
      }
    
    return <List navigationTitle="Inboxes" searchBarPlaceholder="Search inbox" isLoading={isLoading || isDeleting} isShowingDetail>
        {data && <List.Section title={`page: ${data.metadata.current_page} of ${data.metadata.total_pages} | per_page: ${data.metadata.per_page} | total_entries: ${data.metadata.total_entries}`}>
            {data.entries.map(inbox => <List.Item key={inbox.id} title={inbox.alias} icon={{ source: Icon.CircleFilled, tintColor: getPeriodicityColor(inbox.periodicity) }} actions={<ActionPanel>
                <Action title="Delete Inbox" icon={Icon.DeleteDocument} style={Action.Style.Destructive} onAction={() => confirmAndDeleteInbox(inbox.id)} />
                {data.metadata.current_page < data.metadata.total_pages && <Action title="Fetch Next Page" icon={Icon.ArrowRight} onAction={() => setPage(data.metadata.current_page+1)} />}
                {data.metadata.current_page > 1 && <Action title="Fetch Previous Page" icon={Icon.ArrowLeft} onAction={() => setPage(data.metadata.current_page-1)} />}
                <ActionPanel.Section>
                    <Action.Push title="Create Inbox" icon={Icon.Plus} target={<CreateInbox account_id={account_id} />} />
                </ActionPanel.Section>
            </ActionPanel>} detail={<List.Item.Detail metadata={<List.Item.Detail.Metadata>
                <List.Item.Detail.Metadata.Label title="ID" text={inbox.id} />
                <List.Item.Detail.Metadata.Link title="Alias" text={inbox.alias} target={`mailto:${inbox.alias}`} />
                <List.Item.Detail.Metadata.TagList title="Periodicity">
                    <List.Item.Detail.Metadata.TagList.Item text={PERIODICITIES[inbox.periodicity] || inbox.periodicity} color={getPeriodicityColor(inbox.periodicity)} />
                </List.Item.Detail.Metadata.TagList>
                <List.Item.Detail.Metadata.Label title="Message Count" text={inbox.message_count.toString()} />
                <List.Item.Detail.Metadata.Label title="Next Due" text={inbox.next_due} />
                <List.Item.Detail.Metadata.Label title="Paused" icon={inbox.paused ? Icon.Check : Icon.Multiply} />
                <List.Item.Detail.Metadata.Label title="Created At" text={inbox.created_at} />
                <List.Item.Detail.Metadata.Label title="Updated At" text={inbox.updated_at} />
            </List.Item.Detail.Metadata>} />} />)}
        </List.Section>}
        {!isLoading && <List.Section title="Actions">
            <List.Item title="Create Inbox" icon={Icon.Plus} actions={<ActionPanel>
                <Action.Push title="Create Inbox" icon={Icon.Plus} target={<CreateInbox account_id={account_id} />} />
            </ActionPanel>} />
        </List.Section> }
    </List>
}

type CreateInboxProps = {
    account_id: string;
}
function CreateInbox({ account_id } : CreateInboxProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<MultiErrorResponse>();

    const { handleSubmit, itemProps } = useForm<CreateInboxFormValues>({
        async onSubmit(values) {
            setIsLoading(true);
            await showToast({ title: "Creating Inbox", style: Toast.Style.Animated });
            
            const params = Object.entries(values).map(([key, val]) => `inbox[${key}]=${val}`).join("&");
            const apiResponse = await fetch(API_URL + `inboxes?account_id=${account_id}&${params}`, { headers: API_HEADERS, method: "POST" });
            const response = await apiResponse.json() as MultiErrorResponse | {inbox: string};
            
            if ("inbox" in response) {
                await showToast({ title: "Inbox Created", message: response.inbox });
            } else { 
                await showFailureToast("");
                setErrors(response)
            };
            setIsLoading(false);
        },
        validation: {
            name(value) {
                if (value?.includes(" ")) return "The item must contain no spaces";
            },
        },
      });

    return errors ? <List isShowingDetail>
        <List.Section title={errors.full_message}>
        {Object.entries(errors.errors).map(([key, val]) => <List.Item key={key} title={key} detail={<List.Item.Detail metadata={<List.Item.Detail.Metadata>
            {val.map((err, index) => <List.Item.Detail.Metadata.Label key={err} title={(index+1).toString()} text={err} />)}
        </List.Item.Detail.Metadata>} />} />)} 
        </List.Section>
    </List> : <Form navigationTitle="Create Inbox" isLoading={isLoading} actions={<ActionPanel><Action.SubmitForm icon={Icon.Check} onSubmit={handleSubmit} /></ActionPanel>}>
        <Form.Description text="Inbox settings" />
        {/* <Form.Description title="Username" text={""} */}
        <Form.TextField title="Name" placeholder="Enter inbox alias (optional)" {...itemProps.name} info="The name of the inbox alias, aka local part of the email to create." />
        <Form.Dropdown title="Periodicity" {...itemProps.periodicity}>
            {Object.entries(PERIODICITIES).map(([value, title]) => <Form.Dropdown.Item key={value} title={title} value={value} />)}
        </Form.Dropdown>
        {/* domain */}
        {/* sender name */}


        {/* <Form.Separator />
        <Form.Description text="Recipients" /> */}
        {/* the defaul one */}
        <Form.TextField title="Additional recipients" {...itemProps.additional_recipients} placeholder="johndoe@example.com, janedoe@example.com" info="Add extra recipient emails separated by commas." />

        <Form.Dropdown title="Delivery" {...itemProps.digest_format} info="Choose the digest email delivery format you would prefer.">
            {Object.entries(DIGEST_FORMATS).map(([value, title]) => <Form.Dropdown.Item key={value} title={title} value={value} />)}
        </Form.Dropdown>
        <Form.TextArea title="Signature" {...itemProps.signature} placeholder="Best Regards" info="Add an optional sign-off to your emails sent via this alias." />
        <Form.TextArea title="Description" {...itemProps.description} placeholder="Add a note about this alias" info="Add optional internal notes to keep yourself organised." />

        <Form.Separator />
        <Form.Description text="Additional Options" />
        <Form.Checkbox label="Bypass first message" info="Send the first email this inbox receives straight to your inbox." {...itemProps.bypass_first_message} />
        <Form.Checkbox label="Pause digest" info="Prevent the digest mailer from sending your daily digest." {...itemProps.paused} />
    </Form>
}