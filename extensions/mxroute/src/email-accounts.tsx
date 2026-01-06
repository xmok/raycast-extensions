import { useCachedPromise } from "@raycast/utils";
import { makeRequest } from "./mxroute";
import { EmailAccount } from "./types";
import { Color, Icon, List } from "@raycast/api";

export default function EmailAccounts({domain}:{domain:string}) {
    const {isLoading,data: accounts} = useCachedPromise(async(domain: string) => {
        const accounts = await makeRequest<EmailAccount[]>(`domains/${domain}/email-accounts`);
        return accounts;
    },[domain],{
        initialData: []
    })

    return <List isLoading={isLoading}>
        {!isLoading && !accounts.length ? <List.EmptyView icon="📨" title="No email accounts found for this domain." /> : accounts.map(account => <List.Item key={account.username} icon={Icon.Envelope} title={account.username} subtitle={account.email} accessories={[{tag: account.suspended ? {value: "Suspended", color: Color.Red} : {value: "Active", color: Color.Green}}]} />)}
    </List>
}