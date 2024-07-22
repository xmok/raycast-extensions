import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { useHabitica } from "./lib/hooks/useHabitiica";
import { User, UserNotification, UserTask } from "./lib/types";
import { getIconURL } from "./lib/utils";

function Actions() {
    return <ActionPanel>
        <Action.Push icon={Icon.List} title="View Tasks" target={<ViewTasks />} />
    </ActionPanel>
}
export default function UserProfile() {
    const { isLoading, data: user } = useHabitica<User, { notifications: UserNotification[], userV: number }>("user");

    return <List isLoading={isLoading} isShowingDetail>
        {user && <>
            <List.Section title="Data">
                <List.Item icon={user.data.auth.local.has_password ? Icon.Lock : Icon.LockUnlocked} title="Auth" subtitle={user.data.auth.local.username} detail={<List.Item.Detail metadata={<List.Item.Detail.Metadata>
                    <List.Item.Detail.Metadata.Label title="Username" text={user.data.auth.local.username} />
                    <List.Item.Detail.Metadata.Label title="Lower Case Username" text={user.data.auth.local.lowerCaseUsername} />
                    <List.Item.Detail.Metadata.Link title="Email" text={user.data.auth.local.email} target={`mailto:${user.data.auth.local.email}`} />
                    <List.Item.Detail.Metadata.Label title="Has Password" icon={user.data.auth.local.has_password ? Icon.Check : Icon.Xmark} />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label title="Logged In" text={new Date(user.data.auth.timestamps.loggedin).toUTCString()} />
                    <List.Item.Detail.Metadata.Label title="Created" text={new Date(user.data.auth.timestamps.created).toUTCString()} />
                    <List.Item.Detail.Metadata.Label title="Updated" text={new Date(user.data.auth.timestamps.updated).toUTCString()} />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.TagList title="Social Auth">
                        <List.Item.Detail.Metadata.TagList.Item text="Facebook" color={Object.keys(user.data.auth.facebook).length ? Color.Green : Color.Red} />
                        <List.Item.Detail.Metadata.TagList.Item text="Google" color={Object.keys(user.data.auth.google).length ? Color.Green : Color.Red} />
                        <List.Item.Detail.Metadata.TagList.Item text="Apple" color={Object.keys(user.data.auth.apple).length ? Color.Green : Color.Red} />
                    </List.Item.Detail.Metadata.TagList>
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label title="Achievements" />
                    <List.Item.Detail.Metadata.TagList title="Ultimate Gear Sets">
                        <List.Item.Detail.Metadata.TagList.Item text="Warrior" color={user.data.achievements.ultimateGearSets.warrior ? Color.Green : Color.Red} />
                        <List.Item.Detail.Metadata.TagList.Item text="Rogue" color={user.data.achievements.ultimateGearSets.rogue ? Color.Green : Color.Red} />
                        <List.Item.Detail.Metadata.TagList.Item text="Wizard" color={user.data.achievements.ultimateGearSets.wizard ? Color.Green : Color.Red} />
                        <List.Item.Detail.Metadata.TagList.Item text="Healer" color={user.data.achievements.ultimateGearSets.healer ? Color.Green : Color.Red} />
                    </List.Item.Detail.Metadata.TagList>
                </List.Item.Detail.Metadata>} />} actions={<Actions />} />
            </List.Section>
            
            <List.Section title="Notifications">
                {user.notifications.map(notification => <List.Item key={notification.id} icon={getIconURL(notification.data.icon) || (notification.seen ? Icon.BellDisabled : Icon.Bell)} title={notification.data.title} detail={<List.Item.Detail markdown={`${notification.data.title} \n\n ${notification.data.text || ""}`} />} actions={<Actions />} />)}
            </List.Section>
        </>}
    </List>
}

function ViewTasks() {
    const { isLoading, data: tasks } = useHabitica<UserTask[]>("tasks/user");

    return <List isLoading={isLoading}>
        {tasks && <List.Section title={`${tasks.data.length} tasks`}>
            {tasks.data.map(task => <List.Item key={task.id} icon={Icon.Dot} title={task.text} accessories={[{ date: new Date(task.updatedAt) }]} />)}
            </List.Section>}
    </List>
}