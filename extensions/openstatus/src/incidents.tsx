import { List } from "@raycast/api";
import { Incident } from "./types";
import useOpenStatus from "./useOpenStatus";

export default function Incidents() {
    const { isLoading, data: incidents } = useOpenStatus<Incident[]>("incident");

    // return <List isLoading={isLoadinng}>
    //     {incidents?.map(incident => <List.Item key={incident.id} title={incident.monitorId} accessories={[
    //         { date: incident.startedAt ? new Date(incident.startedAt) : un }
    //     ]} />)}
    // </List>
}