import { Icon, List } from "@raycast/api";
import { StatusPage } from "./types";
import useOpenStatus from "./useOpenStatus";

export default function StatusPages() {
    const { isLoading, data: pages } = useOpenStatus<StatusPage[]>("page");

    return <List isLoading={isLoading}>
        {pages?.map(page => <List.Item key={page.id} icon={page.passwordProtected ? Icon.Lock : Icon.LockUnlocked} title={page.title} subtitle={page.slug} />)}
    </List>
}