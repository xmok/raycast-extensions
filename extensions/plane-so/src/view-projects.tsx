import { Action, ActionPanel, Detail, Icon, List, openExtensionPreferences } from "@raycast/api";
import { generateApiWorkspaceUrl } from "./lib/utils";
import { usePlanePaginated } from "./lib/use-plane";
import { Issue, IssueActivity, Project } from "./lib/types";

export default function ViewProjects() {
    const url = generateApiWorkspaceUrl();
    if (!url) return <Detail markdown={`Invalid Plane URL \n\n Please make sure all Preferences are valid`} actions={<ActionPanel>
        <Action icon={Icon.Gear} title="Open Extension Preferences" onAction={openExtensionPreferences} />
    </ActionPanel>} />

    const { isLoading, data: projects, pagination } = usePlanePaginated<Project>("projects");

    return <List isLoading={isLoading} searchBarPlaceholder="Search project" pagination={pagination}>
        {projects.map(project => <List.Item key={project.id} icon={{ source: "briefcase.svg", tintColor: project.logo_props.icon.color }} title={project.name} subtitle={project.identifier} accessories={[ { date: new Date(project.created_at) } ]} actions={<ActionPanel>
            <Action.Push icon={Icon.Circle} title="View Issues" target={<ViewIssues project={project} />} />
        </ActionPanel>} />)}
    </List>
}

function ViewIssues({ project }: { project: Project }) {
    const { isLoading, data: issues, pagination } = usePlanePaginated<Issue>(`projects/${project.id}/issues`);

    return <List isLoading={isLoading} searchBarPlaceholder={`Search issues in ${project.name}`} isShowingDetail pagination={pagination}>
        <List.Section title={`${project.name} > Issues (${issues.length})`}>
            {issues.map(issue => <List.Item key={issue.id} icon={Icon.Circle} title={issue.name} subtitle={`${project.identifier} ${issue.sequence_id}`} detail={<List.Item.Detail markdown={issue.description_html} />} actions={<ActionPanel>
                <Action.Push icon={Icon.Ellipsis} title="View Issue Activity" target={<ViewIssueActivity project={project} issue={issue} />} />
            </ActionPanel>} />)}
        </List.Section>
    </List>
}

function ViewIssueActivity({ project, issue }: { project: Project, issue: Issue }) {
    const { isLoading, data: activities, pagination } = usePlanePaginated<IssueActivity>(`projects/${project.id}/issues/${issue.id}/activities`);

    function getActivityIcon(activity: IssueActivity) {
        if (activity.verb==="created") return Icon.Circle;
        if (activity.field==="labels") return Icon.Tag;
        return Icon.Ellipsis;
    }

    return <List isLoading={isLoading} searchBarPlaceholder={`Search ${issue.name} activity`} pagination={pagination}>
        <List.Section title={`${project.name} > ${issue.name} > Activity`}>
        {activities.map(activity => <List.Item key={activity.id} icon={getActivityIcon(activity)} title={activity.comment} subtitle={activity.verb} accessories={[ {date: new Date(activity.created_at) } ]} />)}
        </List.Section>
    </List>
}