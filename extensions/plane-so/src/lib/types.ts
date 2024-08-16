
export type Project = {
    "id": string;
    "total_members": number;
    "total_cycles": number;
    "total_modules": number;
    "is_member": boolean;
    "sort_order": number;
    "member_role": number;
    "is_deployed": boolean;
    "created_at": string;
    "updated_at": string;
    "deleted_at": string | null;
    "name": string;
    "description": string;
    "description_text": string | null;
    "description_html": string | null;
    "network": number;
    "identifier": string;
    // "emoji": null,
    // "icon_prop": null,
    "module_view": boolean;
    "cycle_view": boolean;
    "issue_views_view": boolean;
    "page_view": boolean;
    "inbox_view": boolean;
    "is_time_tracking_enabled": boolean;
    "is_issue_type_enabled": boolean;
    "cover_image": string;
    "archive_in": number;
    "close_in": number;
    "logo_props": {
      "icon": {
        "name": string;
        "color": string;
      },
      "in_use": string;
    },
    // "archived_at": null,
    "created_by": string;
    "updated_by": string;
    "workspace": string;
    // "default_assignee": null,
    // "project_lead": null,
    // "estimate": null,
    // "default_state": null
}

export type Issue = {
    "id": string;
    "created_at": string;
    "updated_at": string;
    // "deleted_at": null,
    // "point": null,
    "name": string;
    "description_html": string;
    // "description_binary": null,
    // "priority": "none",
    // "start_date": null,
    // "target_date": null,
    "sequence_id": number;
    "sort_order": number;
    // "completed_at": null,
    // "archived_at": null,
    "is_draft": boolean;
    // "external_source": null,
    // "external_id": null,
    "created_by": string;
    "updated_by": string;
    "project": string;
    "workspace": string;
    // "parent": null,
    "state": string;
    // "estimate_point": null,
    // "type": null,
    // "assignees": [],
    "labels": string[];
}

export type IssueActivity = {
    "id": string;
    "created_at": string;
    "updated_at": string;
    // "deleted_at": null,
    "verb": string;
    "field": string;
    // "old_value": null,
    // "new_value": null,
    "comment": string;
    // "attachments": [],
    // "old_identifier": null,
    // "new_identifier": null,
    "epoch": number;
    "project": string;
    "workspace": string;
    "issue": string;
    "issue_comment": string | null;
    "actor": string;
}
  
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
}