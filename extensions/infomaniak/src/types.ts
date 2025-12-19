export type Account = {
      "id": number
      "name": string
      "legal_entity_type": "company" | "individual" | "public_body" | "restrict"
      "created_at": number
      "type": string
      "is_customer": boolean,
      "is_sso": boolean,
    }
    export type User = {
        "user_id": number,
      "first_name": string
      "last_name": string
      "display_name": string
      "email": string
    }

export type SuccessResult<T> = {
  "result": "success",
  "data": T
}
export type PaginatedResult<T> = {
    "result": "success",
    "data": T[]
  "total": number
  "pages": number
  "items_per_page": number
  "page": number
}
export type ErrorResult = {
  "result": "error",
  "error":
  {
    "code": string
    "description": string
    errors?: Array<{
        "code": string
        "description": string
        context: Record<string,string | number>
    }>
  }
}
// export type Result<T> = PaginatedResult<T> | SuccessResult<T> | ErrorResult
