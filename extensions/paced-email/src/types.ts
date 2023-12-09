type Account = {
    id: string;
    name: string;
    avatar_path: string;
    subscribed: boolean;
    plan: string;
}

export enum Periodicity {
    daily = "daily",
    weekly = "weekly",
    monthly = "monthly"
}
export type Inbox = {
    id: string;
    alias: string;
    periodicity: Periodicity;
    message_count: number;
    next_due: string;
    paused: boolean;
    created_at: string;
    updated_at: string;
}

enum DigestFormat {
    full = "full",
    summary = "summary"
}

export type CreateInboxParameters = {
    name: string;
    periodicity: Periodicity;
    digest_format: DigestFormat;
    description: string;
    domain_id?: string;
    username_id?: string;
    bypass_first_message: boolean;
    paused: boolean;
    additional_recipients: string;
    signature: string;
    // selected_recipient_ids: string[];
}
export type CreateInboxFormValues = {
    name: string;
    periodicity: string;
    digest_format: string;
    description: string;
    domain_id?: string;
    username_id?: string;
    bypass_first_message: boolean;
    paused: boolean;
    additional_recipients: string;
    signature: string;
    // selected_recipient_ids: string[];
}
export type Domain = {
    id: string;
    host_name: string;
    valid_dns: boolean;
}

export type User = {
    id: string;
    email: string;
    time_zone: string;
}

export type PaginatedList = {
    entries: Account[] | Inbox[] | User[] | Domain[];
    metadata: {
        current_page: number;
        per_page: number;
        total_entries: number;
        total_pages: number;
    }
}

type PaginatedListBase = {
    metadata: {
        current_page: number;
        per_page: number;
        total_entries: number;
        total_pages: number;
    }
}

export type AccountsResponse = PaginatedListBase & { entries: Account[] };
export type InboxesResponse = PaginatedListBase & { entries: Inbox[] };
export type UsersResponse = PaginatedListBase & { entries: User[] };
export type DomainsResponse = PaginatedListBase & { entries: Domain[] };

export type SingleErrorResponse = { error: string };

type ErrorObject = { [key: string]: string[] };
export type MultiErrorResponse = { errors: ErrorObject, full_message: string };