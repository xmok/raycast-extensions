import { getPreferenceValues } from "@raycast/api";
import { Article, ArticleState, Changelog, ChangelogState, CreateArticleRequest, CreateChangelogRequest, ErrorResult, PaginatedResult, Post } from "./types";

const {api_key} = getPreferenceValues<Preferences>();
const API_URL = "https://do.featurebase.app/v2";
const API_HEADERS = {
    "X-API-Key": api_key,
        'Content-Type': 'application/json'
}
const FEATUREBASE_LIMIT = 20

const makeRequest = async <T>(endpoint: string, options?: RequestInit) => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: options?.method || "GET",
        headers: API_HEADERS,
        body: options?.body ? JSON.stringify(options.body) : undefined
    })
    if (response.status===204) return undefined as T;
    const result = await response.json();
    if (!response.ok) {
    const err = result as ErrorResult;
    throw new Error("error" in err ? err.error : err.message)
    }
    return result as T
}
    
export const featurebase = {
    changelog: {
        create: (props: CreateChangelogRequest) => makeRequest<{changelog: Changelog}>("changelog", {method: "POST", body: JSON.stringify(props)}),
        delete: (props: {id: string}) => makeRequest<{changelog: Changelog}>("changelog", {method: "DELETE", body: JSON.stringify(props)}),
        list: (props: {page: number, state: ChangelogState}) => makeRequest<PaginatedResult<Changelog>>(`changelog?state=${props.state}&page=${props.page}&limit=${FEATUREBASE_LIMIT}`)
    },
    helpCenter: {
        articles: {
            create: (props: CreateArticleRequest) => makeRequest<Article>(`help_center/articles`, {method: "POST", body: JSON.stringify(props)}),
            delete: (props: {id: string}) => makeRequest<{success: true}>(`help_center/articles/${props.id}`, {method: "DELETE"}),
            list: (props: {page: number, state: ArticleState}) => makeRequest<PaginatedResult<Article>>(`help_center/articles?state=${props.state}&page=${props.page}&limit=${FEATUREBASE_LIMIT}`)
        }
    },
    posts: {
        list: (props: {page: number}) => makeRequest<PaginatedResult<Post>>(`posts?page=${props.page}&limit=${FEATUREBASE_LIMIT}`)
    }
}
