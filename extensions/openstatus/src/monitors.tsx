import { Action, ActionPanel, Color, Form, Icon, List } from "@raycast/api";
import { Monitor } from "./types";
import useOpenStatus from "./useOpenStatus";

export default function Monitors() {
    const { isLoading, data: monitors } = useOpenStatus<Monitor[]>("monitor");

    return <List isLoading={isLoading}>
        {monitors?.map(monitor => <List.Item key={monitor.id} icon={{ source: Icon.Dot, tintColor: monitor.active ? Color.Green : Color.Red }} title={monitor.name || ""} subtitle={monitor.url} accessories={[
        { text: `every ${monitor.periodicity}` },
        {tag: { value: "PUBLIC", color: monitor.public ? Color.Green : Color.Red }}
        ]} actions={<ActionPanel>
            <Action.Push title="Update Monitor" icon={Icon.Pencil} target={<UpdateMonitor monitor={monitor} />} />
        </ActionPanel>} />)}
    </List>
}

function UpdateMonitor(monitor: Monitor) {
    return <Form navigationTitle="Update Monitor">
        <Form.Description text="Scheduling" />
        <Form.Dropdown title="Frequency">
            {["30s", "1m", "5m", "10m", "30m", "1hr"].map(periodicity => <Form.Dropdown.Item key={periodicity} title={periodicity} value={periodicity} />)}
        </Form.Dropdown>
    </Form>
}