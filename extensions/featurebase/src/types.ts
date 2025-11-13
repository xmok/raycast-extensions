export enum ChangelogState {
    Draft= "draft",
Published="live"
}
export type Changelog = {
    date:string
    organization: string
          "type": "changelog",
id:string
    featuredImage?: string
    title:string
    state: ChangelogState
}
export type CreateChangelogRequest = {
    title: string
    markdownContent: string
}
export enum ArticleState {
    Draft= "draft",
Published="live"
}
export type Article = {
    organizationId: string
    articleId: string;
    title: string;
    state: ArticleState;
}
export type CreateArticleRequest = {
    title: string
    description: string;
}
export type Post = {
    id: string
    title: string
    content: string
}

export type PaginatedResult<T> = {
    "results": T[],
  "page": number
  "limit": number
  "totalPages": number
  "totalResults": number
}
export type ErrorResult = {
    code: number
    message: string
} | {
    success: false;
    error: string
}