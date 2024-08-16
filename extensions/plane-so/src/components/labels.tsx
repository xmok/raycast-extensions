import { Action, ActionPanel, Form, Icon, List, showToast, Toast, useNavigation } from "@raycast/api";
import { Label, Project } from "../lib/types";
import { usePlane, usePlanePaginated } from "../lib/use-plane";
import { useState } from "react";
import { FormValidation, useForm } from "@raycast/utils";
import { PRESET_LABEL_COLORS } from "../lib/config";

export default function ViewLabels({ project }: { project: Project }) {
    const { isLoading, data: labels, pagination, revalidate } = usePlanePaginated<Label>(`projects/${project.id}/labels`);

    return <List isLoading={isLoading} searchBarPlaceholder="Search label" pagination={pagination}>
        {labels.map(label => <List.Item key={label.id} icon={{ source: Icon.CircleFilled, tintColor: label.color }} title={label.name} accessories={[{ date: new Date(label.created_at) }]} actions={<ActionPanel>
            <Action.Push icon={Icon.Pencil} title="Update Label" target={<UpdateLabel project={project} initialLabel={label} onUpdated={revalidate} />} />
            <Action.Push icon={Icon.Plus} title="Add Label" target={<AddLabel project={project} onAdded={revalidate} />} />
        </ActionPanel>} />)}
    </List>
}

function AddLabel({ project, onAdded }: { project: Project, onAdded: () => void }) {
    const { pop } = useNavigation();

    type AddLabel = {
        name: string;
        color: string;
    }
    const [execute, setExecute] = useState(false);
    const { itemProps, handleSubmit, values } = useForm<AddLabel>({
        onSubmit() {
            setExecute(true);
        },
        validation: {
            name: FormValidation.Required
        }
    })
    
    const { isLoading } = usePlane<Label>(`projects/${project.id}/labels/`, {
        method: "POST",
        body: values,
        execute,
        async onData(data) {
            onAdded();
            await showToast(Toast.Style.Success, "Created Label", data.name);
            pop();
        },
        onError() {
            setExecute(false);
        },
    })

    return <Form isLoading={isLoading} actions={<ActionPanel>
        <Action.SubmitForm icon={Icon.Plus} title="Add Label" onSubmit={handleSubmit} />
    </ActionPanel>}>
    <Form.Description title="Project" text={project.name} />
        <Form.TextField title="Title" placeholder="Label title" {...itemProps.name} />
        <Form.Dropdown title="Color" placeholder="Color" {...itemProps.color}>
            {PRESET_LABEL_COLORS.map(color => <Form.Dropdown.Item key={color} icon={{ source: Icon.CircleFilled, tintColor: color }} title={color} value={color} />)}
        </Form.Dropdown>
    </Form>
}

function UpdateLabel({ project, initialLabel, onUpdated }: { project: Project, initialLabel: Label, onUpdated: () => void }) {
    const { pop } = useNavigation();

    type UpdateLabel = {
        name: string;
        color: string;
    }
    const [execute, setExecute] = useState(false);
    const { itemProps, handleSubmit, values } = useForm<UpdateLabel>({
        onSubmit() {
            setExecute(true);
        },
        initialValues: {
            name: initialLabel.name,
            color: initialLabel.color
        },
        validation: {
            name: FormValidation.Required
        }
    })
    
    const { isLoading } = usePlane<Label>(`projects/${project.id}/labels/${initialLabel.id}`, {
        method: "PATCH",
        body: values,
        execute,
        async onData(data) {
            onUpdated();
            await showToast(Toast.Style.Success, "Updated Label", data.name);
            pop();
        },
        onError() {
            setExecute(false);
        },
    })

    return <Form isLoading={isLoading} actions={<ActionPanel>
        <Action.SubmitForm icon={Icon.Plus} title="Update Label" onSubmit={handleSubmit} />
    </ActionPanel>}>
    <Form.Description title="Project" text={project.name} />
        <Form.TextField title="Title" placeholder="Label title" {...itemProps.name} />
        <Form.Dropdown title="Color" placeholder="Color" {...itemProps.color}>
            {PRESET_LABEL_COLORS.map(color => <Form.Dropdown.Item key={color} icon={{ source: Icon.CircleFilled, tintColor: color }} title={color} value={color} />)}
        </Form.Dropdown>
    </Form>
}