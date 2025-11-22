export type Link = {
"address": string,
"banned": boolean,
"created_at": string
"id": string
"link": string,
"password": boolean,
"target": string,
"description": string,
"updated_at": string,
"visit_count": number
}

export type PaginatedResult<T> = {
    limit: number,
    skip: number,
    total: number,
    data: T[]
}
