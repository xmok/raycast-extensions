import { Action, ActionPanel, Color, Form, Icon, List } from "@raycast/api";
import { Monitor } from "./types";
import useOpenStatus from "./useOpenStatus";
import { FormValidation, useForm } from "@raycast/utils";
import { Fragment, useState } from "react";

export default function Monitors() {
    const { isLoading, data: monitors } = useOpenStatus<Monitor[]>("monitor");

    return <List isLoading={isLoading}>
        {monitors?.map(monitor => <List.Item key={monitor.id} icon={{ tooltip: monitor.active ? "Monitor is active" : "Monitor is inactive", value: {source: Icon.Dot, tintColor: monitor.active ? Color.Green : Color.Red }} } title={monitor.name || ""} subtitle={monitor.url} accessories={[
        { text: `every ${monitor.periodicity}` },
        {tag: { value: "PUBLIC", color: monitor.public ? Color.Green : Color.Red }}
        ]} actions={<ActionPanel>
            <Action.Push title="Update Monitor" icon={Icon.Pencil} target={<UpdateMonitor monitor={monitor} />} />
        </ActionPanel>} />)}
    </List>
}

function UpdateMonitor({monitor}: {monitor: Monitor}) {
    const initialMonitor = monitor;
    // const [headers, setHeaders] = useState<({key: string; value: string}[])>([{
    //     key: "",
    //     value: ""
    // }]);
    const [numOfHeaders, setNumOfHeaders] = useState(1);

    type FormValues = {
        periodicity: string;
        url: string;
        regions: string[];
        name: string;
        description: string;
        method: string;
        body: string;
        active: boolean;
        public: boolean;
        headers: {key: string; value: string}[] | null;
    }
    const { itemProps, handleSubmit, values } = useForm<FormValues>({
        onSubmit(values) {
            
        },
        validation: {
            periodicity: FormValidation.Required,
            url: FormValidation.Required,
            regions: FormValidation.Required,
            method: FormValidation.Required,
        }
    });

    const REGIONS = {
        ams: "Amsterdam, Netherlands 🇳🇱",
        iad: "Ashburn, Virginia, USA 🇺🇸",
        hkg: "Hong Kong, Hong Kong 🇭🇰",
        jnb: "Johannesburg, South Africa 🇿🇦",
        syd: "Johannesburg, South Africa 🇿🇦",
        gru: "Sao Paulo, Brazil 🇧🇷"
    }

    return <Form navigationTitle="Update Monitor">
        <Form.Description title="Basic Information" text="Be able to find your monitor easily" />
        <Form.TextField title="Name" placeholder="Documenso" info="Displayed on the status page" {...itemProps.name} />
        <Form.Checkbox label="Active" info="If the monitor is active" {...itemProps.active} />

        <Form.Separator />
        <Form.Description title="Request" text="HTTP Request Settings" />
        <Form.Dropdown title="Method" {...itemProps.method}>
            {["GET", "POST", "HEAD"].map(method => <Form.Dropdown.Item key={method} title={method} value={method} />)}
        </Form.Dropdown>
        <Form.TextField title="URL" placeholder="https://documenso.com/api/health" info="The url to monitor" {...itemProps.url} />
        <Form.Description text="Request Header" />
        {/* {headers.map((header, headerIndex) => <Fragment key={headerIndex}>
            <Form.TextField title="key" id={`header${headerIndex}_key`} />
            <Form.TextField title="value" id={`header${headerIndex}_value`} />
        </Fragment>)} */}
        {[...Array(numOfHeaders).keys()].map(_ => <Fragment key={_}>
            <Form.TextField title={`key ${_+1}`} id={`header${_}_key`} />
            <Form.TextField title={`value ${_+1}`} id={`header${_}_value`} />
        </Fragment>)}

        {values.method==="POST" && <Form.TextArea title="Body" placeholder={`{ "hello": "world" }`} info="Write your json payload." {...itemProps.body} />}

        <Form.Separator />
        <Form.Description title="Scheduling" text="How often the monitor should run" />
        <Form.Dropdown title="Frequency" {...itemProps.periodicity} info="How often the monitor should run">
            {["30s", "1m", "5m", "10m", "30m", "1hr"].map(periodicity => <Form.Dropdown.Item key={periodicity} title={periodicity} value={periodicity} />)}
        </Form.Dropdown>
        <Form.TagPicker title="Regions" {...itemProps.regions}>
            {Object.entries(REGIONS).map(([title, value]) => <Form.TagPicker.Item key={title} title={title} value={value} />)}
        </Form.TagPicker>

        <Form.Separator />
        <Form.Description title="Status Page" text="Customize the informations about your monitor on the corresponding status page" />
        <Form.TextField title="Description" placeholder="Determines the api health of our services" info="Provide your users with information about it" {...itemProps.description} />

        <Form.Separator />
        <Form.Description title="Danger" text="Be aware of the changes you are about to make." />
        <Form.Checkbox label="Allow public monitor" info="Change monitor visibility" {...itemProps.public} />
        <Form.Description text={`Change monitor visibility. When checked, the monitor stats from the overview page will be public. You will be able to share it via a connected status page or openstatus.dev/public/monitors/${initialMonitor.id}.`} />
    </Form>
}