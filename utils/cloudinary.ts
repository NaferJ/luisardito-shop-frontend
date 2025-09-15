// utils/cloudinary.ts
// Simple unsigned upload helper for Cloudinary
// Requires env vars:
// - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
// - NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET (unsigned)

export interface CloudinaryUploadResult {
  secure_url: string
  url: string
  public_id?: string
  [key: string]: any
}

export function getCloudinaryConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Faltan variables de entorno de Cloudinary. Define NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET en .env.local'
    )
  }

  return { cloudName, uploadPreset }
}

export async function uploadImageToCloudinary(
  file: File,
  options?: { folder?: string; onProgress?: (progress: number) => void }
): Promise<CloudinaryUploadResult> {
  const { cloudName, uploadPreset } = getCloudinaryConfig()

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  if (options?.folder) formData.append('folder', options.folder)

  // If progress callback provided, use XHR and return parsed JSON from response
  if (typeof window !== 'undefined' && options?.onProgress) {
    return await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', endpoint)
      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText) as CloudinaryUploadResult
          resolve(json)
        } catch (e) {
          reject(new Error('Respuesta inválida de Cloudinary'))
        }
      }
      xhr.onerror = () => reject(new Error('Error subiendo imagen a Cloudinary'))
      if (xhr.upload && options.onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100)
            options.onProgress!(progress)
          }
        }
      }
      xhr.send(formData)
    })
  }

  // Fallback: simple fetch without progress
  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Cloudinary error: ${text}`)
  }

  const json = (await res.json()) as CloudinaryUploadResult
  return json
}
