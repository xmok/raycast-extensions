import { List } from "@raycast/api";
import { Incident } from "./types";
import useOpenStatus from "./useOpenStatus";

export default function Incidents() {
    const { isLoading, data: incidents } = useOpenStatus<Incident[]>("incident");

    return <List isLoading={isLoading}>
        {incidents?.map(incident => <List.Item key={incident.id} title={incident.monitorId?.toString() || ""} accessories={[
            { date: incident.startedAt ? new Date(incident.startedAt) : undefined }
        ]} />)}
    </List>
}