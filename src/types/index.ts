export interface Material {
    id: string
    title: string
    description: string | null
    file_url: string
    user_id: string
    created_at: string
    subject?: string
    branch?: string
    semester?: string
    module?: string
    college_details?: string
    uploader_name?: string
}
