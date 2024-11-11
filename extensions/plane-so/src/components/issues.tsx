import { Action, ActionPanel, Detail, Form, Icon, Keyboard, List, showToast, Toast, useNavigation } from "@raycast/api";
import { Issue, IssueActivity, IssueWithLabelsAndState, Label, Link, Project, State } from "../lib/types";
import { usePlane, usePlanePaginated } from "../lib/use-plane";
import { useState } from "react";
import { FormValidation, getFavicon, useForm } from "@raycast/utils";
import { STATE_GROUP_ICONS } from "../lib/config";
import { NodeHtmlMarkdown } from "node-html-markdown";

export default function ViewIssues({ project }: { project: Project }) {
  const {
    isLoading,
    data: issues,
    pagination,
    revalidate,
  } = usePlanePaginated<IssueWithLabelsAndState>(`projects/${project.id}/issues`, {
    expand: ["labels", "state"],
  });

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder={`Search issues in ${project.name}`}
      isShowingDetail
      pagination={pagination}
    >
      <List.Section title={`${project.name} > Issues (${issues.length})`}>
        {issues.map((issue) => {
          const uniqueLabels = [...new Map(issue.labels.map((label) => [label.id, label])).values()]; // when updating labels via API, labels are sometimes repeated though they are not shown
          return (
            <List.Item
              key={issue.id}
              icon={{ source: Icon.Circle, tintColor: issue.state.color }}
              title={issue.name}
              subtitle={`${project.identifier} ${issue.sequence_id}`}
              detail={
                <List.Item.Detail
                  markdown={`# ${issue.name} \n\n --- \n\n ${NodeHtmlMarkdown.translate(issue.description_html)}`}
                  metadata={
                    <List.Item.Detail.Metadata>
                      <List.Item.Detail.Metadata.Label title={project.identifier} text={issue.sequence_id.toString()} />
                      {uniqueLabels.length ? (
                        <List.Item.Detail.Metadata.TagList title="Labels">
                          {uniqueLabels.map((label) => (
                            <List.Item.Detail.Metadata.TagList.Item
                              key={label.id}
                              text={label.name}
                              color={label.color}
                            />
                          ))}
                        </List.Item.Detail.Metadata.TagList>
                      ) : (
                        <List.Item.Detail.Metadata.Label title="Labels" icon={Icon.Minus} />
                      )}
                      <List.Item.Detail.Metadata.TagList title="State">
                        <List.Item.Detail.Metadata.TagList.Item text={issue.state.name} color={issue.state.color} />
                      </List.Item.Detail.Metadata.TagList>
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ActionPanel>
                  <Action.Push
                    icon={Icon.Ellipsis}
                    title="View Issue Activity"
                    target={<ViewIssueActivity project={project} issue={issue} />}
                  />
                  <Action.Push
                    icon={Icon.Link}
                    title="View Issue Links"
                    target={<ViewIssueLinks project={project} issue={issue} />}
                  />
                  <Action.Push
                    icon={Icon.Pencil}
                    title="Update Issue"
                    target={<UpdateIssue project={project} initialIssue={issue} onUpdated={revalidate} />}
                    shortcut={Keyboard.Shortcut.Common.Edit}
                  />
                  <Action.Push
                    icon={Icon.Plus}
                    title="Add Issue"
                    target={<AddIssue project={project} onAdded={revalidate} />}
                    shortcut={Keyboard.Shortcut.Common.New}
                  />
                </ActionPanel>
              }
            />
          );
        })}
      </List.Section>
    </List>
  );
}

function ViewIssueActivity({ project, issue }: { project: Project; issue: IssueWithLabelsAndState }) {
  const {
    isLoading,
    data: activities,
    pagination,
  } = usePlanePaginated<IssueActivity>(`projects/${project.id}/issues/${issue.id}/activities`);

  function getActivityIcon(activity: IssueActivity) {
    if (activity.comment === "created the issue") return "issues.svg";
    if (activity.field === "labels") return Icon.Tag;
    if (activity.field === "description" || activity.field === "link") return Icon.SpeechBubble;
    if (activity.verb === "created") return Icon.Plus;
    return Icon.Ellipsis;
  }

  return (
    <List isLoading={isLoading} searchBarPlaceholder={`Search ${issue.name} activity`} pagination={pagination}>
      <List.Section title={`${project.name} > ${issue.name} > Activity`}>
        {activities.map((activity) => (
          <List.Item
            key={activity.id}
            icon={getActivityIcon(activity)}
            title={activity.comment}
            subtitle={activity.verb}
            accessories={[{ date: new Date(activity.created_at) }]}
          />
        ))}
      </List.Section>
    </List>
  );
}

function ViewIssueLinks({ project, issue }: { project: Project; issue: IssueWithLabelsAndState }) {
  const {
    isLoading,
    data: links,
    pagination,
  } = usePlanePaginated<Link>(`projects/${project.id}/issues/${issue.id}/links`);

  return (
    <List isLoading={isLoading} searchBarPlaceholder={`Search ${issue.name} links`} pagination={pagination}>
      <List.Section title={`${project.name} > ${issue.name} > Links`}>
        {links.map((link) => (
          <List.Item
            key={link.id}
            icon={getFavicon(link.url)}
            title={link.title}
            subtitle={link.url}
            accessories={[{ date: new Date(link.created_at) }]}
          />
        ))}
      </List.Section>
    </List>
  );
}

function AddIssue({ project, onAdded }: { project: Project; onAdded: () => void }) {
  const { isLoading: isLoadingLabels, data: labels } = usePlanePaginated<Label>(`projects/${project.id}/labels`);
  const { isLoading: isLoadingStates, data: states } = usePlanePaginated<State>(`projects/${project.id}/states`);

  const { pop } = useNavigation();

  type AddIssue = {
    name: string;
    description_html: string;
    labels: string[];
    state: string;
  };
  const [execute, setExecute] = useState(false);
  const { itemProps, handleSubmit, values } = useForm<AddIssue>({
    onSubmit() {
      setExecute(true);
    },
    initialValues: {
      state: states.find((state) => state.default)?.id,
    },
    validation: {
      name: FormValidation.Required,
    },
  });

  const { isLoading: isAdding } = usePlane<Issue>(`projects/${project.id}/issues/`, {
    method: "POST",
    body: values,
    execute,
    async onData(data) {
      onAdded();
      await showToast(Toast.Style.Success, "Created Issue", data.name);
      pop();
    },
    onError() {
      setExecute(false);
    },
  });

  const isLoading = isLoadingLabels || isLoadingStates || isAdding;

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm icon={Icon.Plus} title="Add Issue" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description title="Project" text={project.name} />
      <Form.TextField title="Title" placeholder="Title" {...itemProps.name} />
      <Form.TextArea title="Description" placeholder="Supports HTML" {...itemProps.description_html} />
      <Form.TagPicker title="Labels" placeholder="Labels" {...itemProps.labels}>
        {labels.map((label) => (
          <Form.TagPicker.Item
            key={label.id}
            icon={{ source: Icon.CircleFilled, tintColor: label.color }}
            title={label.name}
            value={label.id}
          />
        ))}
      </Form.TagPicker>
      <Form.Dropdown title="State" placeholder="State" {...itemProps.state}>
        {Object.keys(STATE_GROUP_ICONS).map((group) => (
          <Form.Dropdown.Section key={group} title={group}>
            {states
              .filter((state) => state.group === group)
              .map((state) => (
                <List.Dropdown.Item
                  key={state.id}
                  icon={{
                    source: STATE_GROUP_ICONS[state.group as keyof typeof STATE_GROUP_ICONS],
                    tintColor: state.color,
                  }}
                  title={state.name}
                  value={state.id}
                />
              ))}
          </Form.Dropdown.Section>
        ))}
      </Form.Dropdown>
    </Form>
  );
}
function UpdateIssue({
  project,
  initialIssue,
  onUpdated,
}: {
  project: Project;
  initialIssue: IssueWithLabelsAndState;
  onUpdated: () => void;
}) {
  const { isLoading: isLoadingLabels, data: labels } = usePlanePaginated<Label>(`projects/${project.id}/labels`);
  const { isLoading: isLoadingStates, data: states } = usePlanePaginated<State>(`projects/${project.id}/states`);

  const { pop, push } = useNavigation();

  type UpdateIssue = {
    name: string;
    description_html: string;
    labels: string[];
    state: string;
  };
  const [execute, setExecute] = useState(false);
  const { itemProps, handleSubmit, values } = useForm<UpdateIssue>({
    onSubmit() {
      setExecute(true);
    },
    initialValues: {
      name: initialIssue.name,
      description_html: initialIssue.description_html,
      labels: initialIssue.labels.map((label) => label.id),
      state: states ? initialIssue.state.id : undefined,
    },
    validation: {
      name: FormValidation.Required,
    },
  });

  const { isLoading: isUpdating } = usePlane<Issue>(`projects/${project.id}/issues/${initialIssue.id}`, {
    method: "PATCH",
    body: values,
    execute,
    async onData(data) {
      onUpdated();
      await showToast(Toast.Style.Success, "Updated Issue", data.name);
      pop();
    },
    onError(error) {
      setExecute(false);
      error.cause &&
        push(
          <Detail
            markdown={
              `# ERROR \n\n` + Object.entries(error.cause).map(([key, values]) => `${key} \n\n \t${values.join(`\n`)}`)
            }
          />,
        );
    },
  });

  const isLoading = isLoadingLabels || isLoadingStates || isUpdating;

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm icon={Icon.Pencil} title="Update Issue" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description title="Project" text={project.name} />
      <Form.TextField title="Title" placeholder="Title" {...itemProps.name} />
      <Form.TextArea title="Description" placeholder="Supports HTML" {...itemProps.description_html} />
      <Form.TagPicker title="Labels" placeholder="Labels" {...itemProps.labels}>
        {labels.map((label) => (
          <Form.TagPicker.Item
            key={label.id}
            icon={{ source: Icon.Dot, tintColor: label.color }}
            title={label.name}
            value={label.id}
          />
        ))}
      </Form.TagPicker>
      <Form.Dropdown title="State" placeholder="State" {...itemProps.state}>
        {Object.keys(STATE_GROUP_ICONS).map((group) => (
          <Form.Dropdown.Section key={group} title={group}>
            {states
              .filter((state) => state.group === group)
              .map((state) => (
                <List.Dropdown.Item
                  key={state.id}
                  icon={{
                    source: STATE_GROUP_ICONS[state.group as keyof typeof STATE_GROUP_ICONS],
                    tintColor: state.color,
                  }}
                  title={state.name}
                  value={state.id}
                />
              ))}
          </Form.Dropdown.Section>
        ))}
      </Form.Dropdown>
    </Form>
  );
}
