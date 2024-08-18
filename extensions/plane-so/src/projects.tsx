import { Action, ActionPanel, Detail, Icon, List, openExtensionPreferences } from "@raycast/api";
import { generateApiWorkspaceUrl } from "./lib/utils";
import { usePlanePaginated } from "./lib/use-plane";
import { Project } from "./lib/types";
import ViewIssues from "./components/issues";
import ViewLabels from "./components/labels";
import ViewModules from "./components/modules";

export default function ViewProjects() {
  const url = generateApiWorkspaceUrl();
  if (!url)
    return (
      <Detail
        markdown={`Invalid Plane URL \n\n Please make sure all Preferences are valid`}
        actions={
          <ActionPanel>
            <Action icon={Icon.Gear} title="Open Extension Preferences" onAction={openExtensionPreferences} />
          </ActionPanel>
        }
      />
    );

  const { isLoading, data: projects, pagination } = usePlanePaginated<Project>("projects");

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search project" pagination={pagination}>
      {projects.map((project) => (
        <List.Item
          key={project.id}
          icon={{ source: "briefcase.svg", tintColor: project.logo_props.icon.color }}
          title={project.name}
          subtitle={project.identifier}
          accessories={[{ date: new Date(project.created_at) }]}
          actions={
            <ActionPanel>
              <Action.Push icon={Icon.Circle} title="View Issues" target={<ViewIssues project={project} />} />
              <Action.Push icon={Icon.Tag} title="View Labels" target={<ViewLabels project={project} />} />
              <Action.Push
                icon={Icon.AppWindowGrid2x2}
                title="View Modules"
                target={<ViewModules project={project} />}
                shortcut={{ modifiers: ["cmd"], key: "m" }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
