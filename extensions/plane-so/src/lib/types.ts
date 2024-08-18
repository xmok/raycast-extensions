type Common = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  updated_by: string;
};

export type Project = Common & {
  total_members: number;
  total_cycles: number;
  total_modules: number;
  is_member: boolean;
  sort_order: number;
  member_role: number;
  is_deployed: boolean;
  name: string;
  description: string;
  description_text: string | null;
  description_html: string | null;
  network: number;
  identifier: string;
  // "emoji": null,
  // "icon_prop": null,
  module_view: boolean;
  cycle_view: boolean;
  issue_views_view: boolean;
  page_view: boolean;
  inbox_view: boolean;
  is_time_tracking_enabled: boolean;
  is_issue_type_enabled: boolean;
  cover_image: string;
  archive_in: number;
  close_in: number;
  logo_props: {
    icon: {
      name: string;
      color: string;
    };
    in_use: string;
  };
  // "archived_at": null,
  workspace: string;
  // "default_assignee": null,
  // "project_lead": null,
  // "estimate": null,
  // "default_state": null
};

export type Issue = {
  id: string;
  created_at: string;
  updated_at: string;
  // "deleted_at": null,
  // "point": null,
  name: string;
  description_html: string;
  // "description_binary": null,
  // "priority": "none",
  // "start_date": null,
  // "target_date": null,
  sequence_id: number;
  sort_order: number;
  // "completed_at": null,
  // "archived_at": null,
  is_draft: boolean;
  // "external_source": null,
  // "external_id": null,
  created_by: string;
  updated_by: string;
  project: string;
  workspace: string;
  // "parent": null,
  state: string;
  // "estimate_point": null,
  // "type": null,
  // "assignees": [],
  labels: string[];
};

export type IssueActivity = {
  id: string;
  created_at: string;
  updated_at: string;
  // "deleted_at": null,
  verb: string;
  field: string;
  // "old_value": null,
  // "new_value": null,
  comment: string;
  // "attachments": [],
  // "old_identifier": null,
  // "new_identifier": null,
  epoch: number;
  project: string;
  workspace: string;
  issue: string;
  issue_comment: string | null;
  actor: string;
};

export type Link = Common & {
  title: string;
  url: string;
  metadata: Record<string, string>;
  project: string;
  workspace: string;
  issue: string;
};

export type Label = Common & {
  name: string;
  description: string;
  color: string;
  sort_order: number;
  // "external_source": null,
  // "external_id": null,
  project: string;
  workspace: string;
  // "parent": null
};
export type State = Common & {
  name: string;
  description: string;
  color: string;
  slug: string;
  sequence: number;
  group: string;
  is_triage: true;
  default: true;
  // "external_source": null,
  // "external_id": null,
  project: string;
  workspace: string;
};

export type Module = Common & {
  total_issues: number;
  cancelled_issues: number;
  completed_issues: number;
  started_issues: number;
  unstarted_issues: number;
  backlog_issues: number;
  name: string;
  description: string;
  // "description_text": null,
  // "description_html": null,
  // "start_date": null,
  // "target_date": null,
  status: string;
  // "view_props": {},
  sort_order: number;
  // "external_source": null,
  // "external_id": null,
  // "archived_at": null,
  // "logo_props": {},
  project: string;
  workspace: string;
  // "lead": null,
  // "members": []
};

// COMBINED
export type IssueWithLabels = Omit<Issue, "labels"> & { labels: Label[] };

export type PaginatedResult<T> = {
  // "grouped_by": null,
  // "sub_grouped_by": null,
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  // "extra_stats": null,
  results: T[];
};
