export type StoryblokSpace = {
    name: string;
    domain?: string;
    uniq_domain?: string;
    plan: string;
    plan_level: number;
    limits?: Record<string, any>;
    created_at: string;
    id: number;
    role?: string;
    owner_id: number;
    story_published_hook?: boolean;
    // environments
    stories_count?: number;
    parent_id?: number;
    assets_count?: number;
    searchblok_id?: number;
    duplicatable?: boolean;
    request_count_today?: number
    api_requests?: number
    exceeded_requests?: number;
    // billing_address: { 
    //     // billing infromation
    // },
    // routes: [ ],
    trial: boolean;
    // euid: null,
    default_root?: string;
    has_slack_webhook?: boolean;
    // api_logs_per_month?: [ ],
    first_token?: string;
    has_pending_tasks?: boolean;
    // options: { },
    // collaborators: [ ],
    // settings: [ ],
    // owner: {
    //   // user object
    // }
    region: string;
    updated_at: string;
    fe_version: string;
    // pending_traffic_boosts: null,
    requires_2fa: boolean;
    // org_id: null,
    // partner_id: null,
    // subscription_status: null,
    // stripe_trial_status: null,
    // stripe_trial_end: null,
    // canceled_at: null,
    org_requires_2fa: boolean;
}