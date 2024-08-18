import { useState } from "react";
import { Module, Project } from "../lib/types";
import { usePlane, usePlanePaginated } from "../lib/use-plane";
import { Action, ActionPanel, Form, Icon, Keyboard, List, showToast, Toast, useNavigation } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";

export default function ViewModules({ project }: { project: Project }) {
  const {
    isLoading,
    data: modules,
    pagination,
    revalidate,
  } = usePlanePaginated<Module>(`projects/${project.id}/modules/`);
  const isEmpty = !isLoading && !modules.length;

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder={`Search modules in ${project.name}`}
      isShowingDetail={!isEmpty}
      pagination={pagination}
    >
      {isEmpty ? (
        <List.EmptyView
          title="Build your first module"
          description="Map your project milestones to Modules and track aggregated work easily."
          actions={
            <ActionPanel>
              <Action.Push
                icon={Icon.Plus}
                title="Add Module"
                target={<AddModule project={project} onAdded={revalidate} />}
                shortcut={Keyboard.Shortcut.Common.New}
              />
            </ActionPanel>
          }
        />
      ) : (
        <List.Section title={`${project.name} > Modules (${modules.length})`}>
          {modules.map((module) => (
            <List.Item
              key={module.id}
              icon={Icon.AppWindowGrid2x2}
              title={module.name}
              detail={
                <List.Item.Detail
                  markdown={module.description}
                  metadata={
                    <List.Item.Detail.Metadata>
                      <List.Item.Detail.Metadata.TagList title="Status">
                        <List.Item.Detail.Metadata.TagList.Item text={module.status} />
                      </List.Item.Detail.Metadata.TagList>
                    </List.Item.Detail.Metadata>
                  }
                />
              }
            />
          ))}
        </List.Section>
      )}
    </List>
  );
}

function AddModule({ project, onAdded }: { project: Project; onAdded: () => void }) {
  const { pop } = useNavigation();

  type AddModule = {
    name: string;
    description: string;
  };
  const [execute, setExecute] = useState(false);
  const { itemProps, handleSubmit, values } = useForm<AddModule>({
    onSubmit() {
      setExecute(true);
    },
    validation: {
      name: FormValidation.Required,
    },
  });

  const { isLoading } = usePlane<Module>(`projects/${project.id}/modules/`, {
    method: "POST",
    body: values,
    execute,
    async onData(data) {
      onAdded();
      await showToast(Toast.Style.Success, "Created Module", data.name);
      pop();
    },
    onError() {
      setExecute(false);
    },
  });

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm icon={Icon.Plus} title="Create Module" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description title="Project" text={project.name} />
      <Form.TextField title="Title" placeholder="Title" {...itemProps.name} />
      <Form.TextArea title="Description" placeholder="Description" {...itemProps.description} />
    </Form>
  );
}
