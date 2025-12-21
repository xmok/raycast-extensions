export type Board = {
    "id": string
    "name": string
    "all_access": boolean
    "created_at": string
    "url": string
}
export type CreateBoardRequest = {
    name: string
    auto_postpone_period: number
}