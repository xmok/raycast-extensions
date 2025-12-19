import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { getAvatarIcon, useCachedPromise } from "@raycast/utils";
import { infomaniak } from "./infomaniak";
import { Account } from "./types";

export default function Accounts() {
  const {isLoading, data: accounts} = useCachedPromise(async() => {
    const {data} = await infomaniak.accounts.list();
    return data;
  }, [], {
    initialData: []
  });
  return <List isLoading={isLoading}>
    <List.Section title={`${accounts.length} accounts`}>
      {accounts.map(account => <List.Item key={account.id} icon={getAvatarIcon(`${account.name[0]} ${account.name[1]}`)} title={account.name} subtitle={account.type==="owner" ? "Legally responsible of the private area" : account.type} actions={<ActionPanel>
      <Action.Push icon={Icon.TwoPeople} title="Users" target={<Users account={account} />} />
    </ActionPanel>} />)}
    </List.Section>
  </List>
}

function Users({account}: {account: Account}) {
  const {isLoading, data: users} = useCachedPromise((accountId: number) => async(options) => {
    const {data, pages} = await infomaniak.accounts.users.list({accountId, page: options.page+1});
    return {
      data,
      hasMore: options.page < pages
    };
  }, [account.id], {
    initialData: []
  })
  return <List isLoading={isLoading}>
    <List.Section title={`${users.length} users`}>
    {users.map(user => <List.Item key={user.user_id} icon={getAvatarIcon(`${user.first_name[0]} ${user.first_name[1]}`)} title={user.display_name} subtitle={user.email} />)}
    </List.Section>
  </List>
}
