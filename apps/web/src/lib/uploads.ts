import { api } from './api'

export interface UploadResult {
  url: string
  originalName: string
  size: number
  mimeType: string
}

export const uploadsApi = {
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api
      .post<UploadResult>('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data)
  },
}
