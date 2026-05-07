export interface ApiMeta {
    requestId: string
    timestamp: string
}
export interface ApiSuccessResponse<T> {
    success: true
    data: T
    meta: ApiMeta
}
export interface ApiErrorPayload {
    code: string
    message: string
    details?: unknown[]
}
export interface ApiErrorResponse {
    success: false
    error: ApiErrorPayload
    meta: ApiMeta
}
export interface Pagination {
    page: number
    perPage: number
    total: number
    totalPages: number
}
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
export interface PaginatedResponse<T> extends ApiSuccessResponse<T[]> {
    pagination: Pagination
}
