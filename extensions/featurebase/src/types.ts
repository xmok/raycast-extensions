export enum ChangelogState {
    Draft= "draft",
Published="live"
}
export type Changelog = {
    date:string
    id:string
    featuredImage?: string
    title:string
    state: ChangelogState
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
}