import { List } from "@raycast/api";
import { useHabitica } from "./lib/hooks/useHabitiica";
import { User, UserNotification } from "./lib/types";

export default function UserProfile() {
    const { isLoading, data: user } = useHabitica<User, { notifications: UserNotification[], userV: number }>("user");

    return <List isLoading={isLoading}>
        {user && <>
            <List.Section title="Data">
                <List.Item title="Auth" />
            </List.Section>
            
            <List.Section title="Notifications">
                {user.notifications.map(notification => <List.Item key={notification.id} title={notification.data.title} subtitle={notification.data.text} accessories={[{tag: notification.type}]} />)}
            </List.Section>
        </>}
    </List>
}