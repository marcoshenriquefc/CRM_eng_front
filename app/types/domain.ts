export type RoleCode = 'ADMIN' | 'MARKETING' | 'COMERCIAL' | 'FINANCEIRO' | 'ENGENHARIA' | 'GESTOR' | 'SUPORTE'
export interface Permission {
    id: string
    code: string
    name: string
}
export interface Role {
    id: string
    code: RoleCode
    name: string
    permissions?: Permission[]
}
export interface Workspace {
    id: string
    name: string
}
export interface AuthUser {
    id: string
    name: string
    email: string
    roles: Role[]
    permissions: string[]
}
export interface Lead {
    id: string
    name: string
    email?: string
}
export interface Company {
    id: string
    name: string
}
export interface Contact {
    id: string
    name: string
}
export interface Form {
    id: string
    name: string
}
export interface FormField {
    id: string
    name: string
    type: string
    required: boolean
}
export interface FormSubmission {
    id: string
    formId: string
    createdAt: string
}
export interface ExternalCredential {
    id: string
    provider: string
}
export interface Campaign {
    id: string
    name: string
    status: string
}
export interface EmailTemplate {
    id: string
    name: string
}
export interface EmailCampaign {
    id: string
    name: string
    status: string
}
export interface EmailSend {
    id: string
    status: string
}
export interface Pipeline {
    id: string
    name: string
}
export interface PipelineStage {
    id: string
    name: string
}
export interface Opportunity {
    id: string
    title: string
    value: number
}
export interface Task {
    id: string
    title: string
    status: string
}
export interface AutomationFlow {
    id: string
    name: string
    status: string
}
export interface BillingDocument {
    id: string
    number: string
    status: string
}
export interface Proposal {
    id: string
    title: string
}
export interface Contract {
    id: string
    title: string
}
export interface Notification {
    id: string
    title: string
    read: boolean
}
export interface AuditLog {
    id: string
    action: string
    createdAt: string
}
export interface ReportMetric {
    key: string
    value: number
}
export interface LeadEvent {
    id: string
    type: string
    createdAt: string
}
