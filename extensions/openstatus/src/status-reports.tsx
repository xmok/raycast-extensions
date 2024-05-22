import { Action, ActionPanel, Color, Form, Icon, List } from "@raycast/api";
import { StatusReport } from "./types";
import useOpenStatus from "./useOpenStatus";
import { FormValidation, useForm } from "@raycast/utils";

export default function StatusReports() {
    const { isLoading, data: reports, revalidate } = useOpenStatus<StatusReport[]>("status_report");

    return <List isLoading={isLoading}>
        {reports && (reports.length ? reports?.map(report => <List.Item key={report.id} icon={Icon.Book} title={report.title} accessories={[
            { tag: report.status }
        ]} />) : <List.EmptyView title="No status reports" description="Create your first status report" icon={{ source: "siren.png", tintColor: Color.PrimaryText }} actions={<ActionPanel>
            <Action.Push title="Create Status Report" target={<CreateStatusReport onReportCreated={revalidate} />} />
        </ActionPanel>} /> )}
    </List>
}

type CreateStatusReportProps = {
    onReportCreated: () => void;
}
function CreateStatusReport({ onReportCreated }: CreateStatusReportProps) {
    type FormValues = {
        title: string;
        status: string;
    }
    const { itemProps, handleSubmit, values } = useForm<FormValues>({
        onSubmit() {
            createReport();
        },
        validation: {
            title: FormValidation.Required,
            status: FormValidation.Required
        }
    });
    const { isLoading, revalidate: createReport } = useOpenStatus<StatusReport[]>("status_report", { execute: false, body: values, onData() {
        onReportCreated();
    } });
    
    return <Form navigationTitle="Create Status Report" isLoading={isLoading} actions={<ActionPanel>
        <Action.SubmitForm title="Submit" icon={Icon.Check} onSubmit={handleSubmit} />
    </ActionPanel>}>
        <Form.TextField title="Title" placeholder="Downtime..." info="The title of your outage" {...itemProps.title} />
        <Form.Dropdown title="Status" info="Select the current status" {...itemProps.status}>
            {/* {["investigating", "identified", "monitoring", "resolved"].map(status => <Form.Dropdown.Item key={status} title={status} value={status} />)} */}
             <Form.Dropdown.Item title="Investigating" value="investigating" icon={Icon.MagnifyingGlass} />
             <Form.Dropdown.Item title="Identified" value="identified" icon={Icon.Fingerprint} />
             <Form.Dropdown.Item title="Monitoring" value="monitoring" icon={Icon.Heartbeat} />
             <Form.Dropdown.Item title="Resolved" value="resolved" icon={Icon.CheckCircle} />
        </Form.Dropdown>
    </Form>
}