import { useCachedPromise } from "@raycast/utils"
import { fizzy } from "./fizzy"
import { Action, ActionPanel, Icon, List } from "@raycast/api"

export default function ManageUsers() {
    const {isLoading, data: users} = useCachedPromise(fizzy.users.list, [], {initialData:[]})

    return <List isLoading={isLoading}>
        {users.map(user => <List.Item key={user.id} icon={user.role==="owner" ? Icon.PersonCircle : Icon.Person} title={user.name} subtitle={user.email_address} accessories={[{tag: user.role}, {date: new Date(user.created_at)}]} actions={<ActionPanel>
                    <Action.OpenInBrowser url={user.url} />
        </ActionPanel>} />)}
    </List>
}
