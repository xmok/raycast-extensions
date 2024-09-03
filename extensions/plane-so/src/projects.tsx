import { Action, ActionPanel, Detail, Icon, List, openExtensionPreferences } from "@raycast/api";
import { generateApiWorkspaceUrl, getProjectIcon } from "./lib/utils";
import { usePlanePaginated } from "./lib/use-plane";
import { Project } from "./lib/types";
import ViewIssues from "./components/issues";
import ViewLabels from "./components/labels";
import ViewModules from "./components/modules";
import { useCachedState } from "@raycast/utils";

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

    const [isShowingDetail, setIsShowingDetail] = useCachedState("show-project-details", false);
  const { isLoading, data: projects, pagination } = usePlanePaginated<Project>("projects");

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search project" pagination={pagination} isShowingDetail={isShowingDetail}>
      {projects.map((project) => (
        <List.Item
          key={project.id}
          icon={getProjectIcon(project.logo_props)}
          title={project.name}
          subtitle={project.identifier}
          accessories={isShowingDetail ? undefined : [{ date: new Date(project.created_at) }]}
          detail={<List.Item.Detail markdown={`![Cover](${project.cover_image}) \n\n ${project.description}`} metadata={<List.Item.Detail.Metadata>
            <List.Item.Detail.Metadata.Label title="Identifier" text={project.identifier} />
          </List.Item.Detail.Metadata>} />}
          actions={
            <ActionPanel>
              <Action icon={Icon.AppWindowSidebarLeft} title="Toggle Project Details" onAction={() => setIsShowingDetail(prev => !prev)} />
              <Action.Push icon={Icon.Circle} title="View Issues" target={<ViewIssues project={project} />} />
              <Action.Push icon={Icon.Tag} title="View Labels" target={<ViewLabels project={project} />} shortcut={{ modifiers: ["cmd"], key: "l" }} />
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
