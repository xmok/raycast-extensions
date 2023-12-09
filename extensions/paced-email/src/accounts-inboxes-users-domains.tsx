import { getAvatarIcon, getFavicon, showFailureToast, useFetch, useForm } from "@raycast/utils";
import { API_HEADERS, API_URL, DEFAULT_DOMAIN, DIGEST_FORMATS, PERIODICITIES } from "./constants";
import { Action, ActionPanel, Alert, Color, Form, Icon, List, Toast, confirmAlert, showToast, useNavigation } from "@raycast/api";
import { AccountsResponse, CreateInboxFormValues, Domain, DomainsResponse, Inbox, InboxesResponse, MultiErrorResponse, Periodicity, SingleErrorResponse, User, UsersResponse } from "./types";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import ErrorComponent from "./components/ErrorComponent";

export default function AccountsInboxesUsersDomains() {
    const [page, setPage] = useState(1);
    const { isLoading, data, error } = useFetch<AccountsResponse>(API_URL + `accounts?page=${page}`, { headers: API_HEADERS });

    return error ? <ErrorComponent error={error} /> : <List isLoading={isLoading} searchBarPlaceholder="Search account" isShowingDetail>
        {data && <List.Section title={`page: ${data.metadata.current_page} of ${data.metadata.total_pages} | per_page: ${data.metadata.per_page} | total_entries: ${data.metadata.total_entries}`}>
        {data.entries.map(account => <List.Item key={account.id} title={account.name} icon={account.avatar_path || getAvatarIcon(account.name)} actions={<ActionPanel>
            <Action.Push title="List Inboxes" icon={Icon.Envelope} target={<ListInboxes account_id={account.id} />} />
            <Action.Push title="List Users" icon={Icon.Person} target={<ListUsers account_id={account.id} />} />
            <Action.Push title="List Domains" icon={Icon.Globe} target={<ListDomains account_id={account.id} />} />
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

    async function confirmAndDeleteInbox(inbox: Inbox) {
        if (
          await confirmAlert({
            title: `Delete inbox '${inbox.alias}'?`,
            message: "This action cannot be undone.",
            icon: { source: Icon.DeleteDocument, tintColor: Color.Red },
            primaryAction: { title: "Delete", style: Alert.ActionStyle.Destructive },
          })
        ) {
            setIsDeleting(true);
            await showToast({ title: "Deleting Inbox", style: Toast.Style.Animated });
            const apiResponse = await fetch(API_URL + `inboxes/${inbox.id}?account_id=${account_id}`, { headers: API_HEADERS, method: "DELETE" });
            const response = await apiResponse.json() as SingleErrorResponse | { inbox_id: string };
            if ("error" in response) {
                await showFailureToast(response.error);
            } else {
                await showToast({ title: "Inbox Deleted", message: inbox.alias });
                revalidate();
            } 
            setIsDeleting(false);
        }
      }
    
    return <List navigationTitle="Inboxes" searchBarPlaceholder="Search inbox" isLoading={isLoading || isDeleting} isShowingDetail>
        {data && <List.Section title={`page: ${data.metadata.current_page} of ${data.metadata.total_pages} | per_page: ${data.metadata.per_page} | total_entries: ${data.metadata.total_entries}`}>
            {data.entries.map(inbox => <List.Item key={inbox.id} title={inbox.alias} icon={{ source: Icon.CircleFilled, tintColor: getPeriodicityColor(inbox.periodicity) }} actions={<ActionPanel>
                <Action title="Delete Inbox" icon={Icon.DeleteDocument} style={Action.Style.Destructive} onAction={() => confirmAndDeleteInbox(inbox)} />
                {data.metadata.current_page < data.metadata.total_pages && <Action title="Fetch Next Page" icon={Icon.ArrowRight} onAction={() => setPage(data.metadata.current_page+1)} />}
                {data.metadata.current_page > 1 && <Action title="Fetch Previous Page" icon={Icon.ArrowLeft} onAction={() => setPage(data.metadata.current_page-1)} />}
                <ActionPanel.Section>
                    <Action.Push title="Create Inbox" icon={Icon.Plus} target={<CreateInbox account_id={account_id} onInboxCreated={revalidate} />} shortcut={{ modifiers: ["cmd"], key: "n" }} />
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
                <Action.Push title="Create Inbox" icon={Icon.Plus} target={<CreateInbox account_id={account_id} onInboxCreated={revalidate} />} />
            </ActionPanel>} />
        </List.Section> }
    </List>
}

type CreateInboxProps = {
    account_id: string;
    onInboxCreated: () => void;
}
function CreateInbox({ account_id, onInboxCreated } : CreateInboxProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<MultiErrorResponse>();
    const [domains, setDomains] = useState<Domain[]>();
    const [users, setUsers] = useState<User[]>();

    const { pop } = useNavigation();

    const { handleSubmit, itemProps } = useForm<CreateInboxFormValues>({
        async onSubmit(values) {
            setIsLoading(true);
            await showToast({ title: "Creating Inbox", style: Toast.Style.Animated });
            
            // Leaving these commented-out lines so when API starts to support username_id properly, we can uncomment and use as a base
            // const recipients = Object.entries(values).filter(([key, val]) => key.startsWith("recipient_") && val).map(([key,]) => key.replace("recipient_", ""));
            // const selected_recipient_ids_param = recipients.map(recipient => `inbox[selected_recipient_ids][]=${encodeURIComponent(recipient)}`).join("&");
            
            // const valuesWithoutRecipients = Object.fromEntries(Object.entries(values).filter(([key,]) => !key.startsWith("recipient_")));
            // const params = Object.entries(valuesWithoutRecipients).map(([key, val]) => `inbox[${key}]=${val}`).join("&");
            // const apiResponse = await fetch(API_URL + `inboxes?account_id=${account_id}&${params}&${selected_recipient_ids_param}`, { headers: API_HEADERS, method: "POST" });
            if (values.domain_id==="") delete values.domain_id;
            if (values.username_id==="") delete values.username_id;
            const params = Object.entries(values).map(([key, val]) => `inbox[${key}]=${val}`).join("&");
            const apiResponse = await fetch(API_URL + `inboxes?account_id=${account_id}&${params}`, { headers: API_HEADERS, method: "POST" });
            const response = await apiResponse.json() as MultiErrorResponse | SingleErrorResponse | {inbox: string};
            
            if ("inbox" in response) {
                await showToast({ title: "Inbox Created", message: response.inbox });
                onInboxCreated();
                pop();
            } else if ("errors" in response) {
                await showFailureToast("");
                setErrors(response);
            } else {
                await showFailureToast(response.error);
            }
            setIsLoading(false);
        },
        validation: {
            name(value) {
                if (value?.includes(" ")) return "The item must contain no spaces";
            },
        },
      });

      async function getDomainsAndUsers() {
        await showToast({ title: "Fetching Domains and Users", style: Toast.Style.Animated });
        
        const [domainsResponse, meResponse] = await Promise.all([
            fetch(API_URL + `domains?account_id=${account_id}`, { headers: API_HEADERS }),
            fetch(API_URL + "me", { headers: API_HEADERS }),
        ]);
        
        const [domainsData, meData] = await Promise.all([
            await domainsResponse.json() as SingleErrorResponse | DomainsResponse,
            await meResponse.json() as SingleErrorResponse | User,
        ])
        
        let numOfDomains = 0;
        if ("entries" in domainsData) {
            numOfDomains = domainsData.entries.length+1;
            setDomains([...domainsData.entries, { id: "", host_name: DEFAULT_DOMAIN, valid_dns: true }]);
        }

        const numOfUsers = 1;
        if ("id" in meData) {
            setUsers([
                {...meData, id: ""}
            ]);
        }
        await showToast({ title: `Fetched ${numOfDomains} domains and ${numOfUsers} user` });
      }

      useEffect(() => {
        getDomainsAndUsers()
      }, [])

      const selectedUsername = users?.find(user => user.id===itemProps.username_id.value)?.email.split("@")[0] || "";
      const selectedDomain = domains?.find(domain => domain.id===itemProps.domain_id.value)?.host_name || itemProps.periodicity.value + "." + DEFAULT_DOMAIN || "";
      const selectedPeriodicity = itemProps.periodicity.value === "daily" ? "🟣" : itemProps.periodicity.value==="monthly" ? "🟡" : "🟢";
      const computedNewInboxName = selectedPeriodicity + ` ${selectedUsername}${itemProps.name.value ? "."+itemProps.name.value : ""}@${selectedDomain}`;

    return errors ? <List isShowingDetail>
        <List.Section title={errors.full_message}>
        {Object.entries(errors.errors).map(([key, val]) => <List.Item key={key} title={key} detail={<List.Item.Detail metadata={<List.Item.Detail.Metadata>
            {val.map((err, index) => <List.Item.Detail.Metadata.Label key={err} title={(index+1).toString()} text={err} />)}
        </List.Item.Detail.Metadata>} />} />)} 
        </List.Section>
    </List> : <Form navigationTitle="Create Inbox" isLoading={isLoading} actions={<ActionPanel><Action.SubmitForm icon={Icon.Check} onSubmit={handleSubmit} /></ActionPanel>}>
        <Form.Description title="Inbox settings" text="Configure a new email alias and decide how often to receive digests" />
        <Form.Description text={computedNewInboxName} />
        <Form.Dropdown title="Username" {...itemProps.username_id}>
            {users?.map(user => <List.Dropdown.Item key={user.id} title={user.email.split("@")[0]} value={user.id} />)}
        </Form.Dropdown>
        <Form.TextField title="Name" placeholder="Enter inbox alias (optional)" {...itemProps.name} info="The name of the inbox alias, aka local part of the email to create." />
        <Form.Dropdown title="Periodicity" {...itemProps.periodicity}>
            {Object.entries(PERIODICITIES).map(([value, title]) => <Form.Dropdown.Item key={value} title={title} value={value} />)}
        </Form.Dropdown>
        <Form.Dropdown title="Domain" {...itemProps.domain_id}>
            {domains?.map(domain => <List.Dropdown.Item key={domain.id} title={domain.host_name} value={domain.id} icon={getFavicon(`https://${domain.host_name}`)} />)}
        </Form.Dropdown>
        
        <Form.Separator />
        {/* <Form.Description title="Recipients" text="Select which teammates should receive this digest. By default, it's you" /> */}
        {/* {users?.map(user => <Form.Checkbox id={`recipient_${user.id}`} key={user.id} label={user.email} />)} */}
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

type ListUsersProps = {
    account_id: string;
}
function ListUsers({ account_id }: ListUsersProps) {
    const [page, setPage] = useState(1);

    const { isLoading, data } = useFetch<UsersResponse>(API_URL + `users?account_id=${account_id}&page=${page}`, { headers: API_HEADERS });
    
    return <List navigationTitle="Users" searchBarPlaceholder="Search user" isLoading={isLoading}>
        {data && <List.Section title={`page: ${data.metadata.current_page} of ${data.metadata.total_pages} | per_page: ${data.metadata.per_page} | total_entries: ${data.metadata.total_entries}`}>
            {data.entries.map(user => <List.Item key={user.id} title={user.email} icon={Icon.Person} accessories={[
                { tag: `ID: ${user.id}` },
                { tag: `Time Zone: ${user.time_zone}` },
            ]} actions={<ActionPanel>
                {data.metadata.current_page < data.metadata.total_pages && <Action title="Fetch Next Page" icon={Icon.ArrowRight} onAction={() => setPage(data.metadata.current_page+1)} />}
                {data.metadata.current_page > 1 && <Action title="Fetch Previous Page" icon={Icon.ArrowLeft} onAction={() => setPage(data.metadata.current_page-1)} />}
                <ActionPanel.Section>
                    <Action.CopyToClipboard title="Copy ID to Clipboard" content={user.id} />
                    <Action.CopyToClipboard title="Copy Email to Clipboard" content={user.email} />
                    <Action.CopyToClipboard title="Copy Time Zone to Clipboard" content={user.time_zone} />
                </ActionPanel.Section>
            </ActionPanel>} />)}
        </List.Section>}
    </List>
}

type ListDomainsProps = {
    account_id: string;
}
function ListDomains({ account_id }: ListDomainsProps) {
    const [page, setPage] = useState(1);

    const { isLoading, data } = useFetch<DomainsResponse>(API_URL + `domains?account_id=${account_id}&page=${page}`, { headers: API_HEADERS });
    
    return <List navigationTitle="Domains" searchBarPlaceholder="Search domain" isLoading={isLoading}>
        {data && <List.Section title={`page: ${data.metadata.current_page} of ${data.metadata.total_pages} | per_page: ${data.metadata.per_page} | total_entries: ${data.metadata.total_entries}`}>
            <List.Item title={DEFAULT_DOMAIN} icon={getFavicon(`https://${DEFAULT_DOMAIN}`)} accessories={[{tag: "DEFAULT_DOMAIN"}]} actions={<ActionPanel>
                    <Action.CopyToClipboard title="Copy Host Name to Clipboard" content={DEFAULT_DOMAIN} />
            </ActionPanel>} />
            {data.entries.map(domain => <List.Item key={domain.id} title={domain.host_name} icon={getFavicon(`https://${domain.host_name}`, { fallback: Icon.Globe })} accessories={[
                { tag: { value: "Valid DNS", color: domain.valid_dns ? Color.Green : Color.Red } }
            ]} actions={<ActionPanel>
                {data.metadata.current_page < data.metadata.total_pages && <Action title="Fetch Next Page" icon={Icon.ArrowRight} onAction={() => setPage(data.metadata.current_page+1)} />}
                {data.metadata.current_page > 1 && <Action title="Fetch Previous Page" icon={Icon.ArrowLeft} onAction={() => setPage(data.metadata.current_page-1)} />}
                <ActionPanel.Section>
                    <Action.CopyToClipboard title="Copy ID to Clipboard" content={domain.id} />
                    <Action.CopyToClipboard title="Copy Host Name to Clipboard" content={domain.host_name} />
                </ActionPanel.Section>
            </ActionPanel>} />)}
        </List.Section>}
    </List>
}