// This file simulates cloud storage for files
// In a real application, this would use Vercel Blob or another cloud storage service

// In-memory storage for files
const fileStorage = new Map<string, { data: Blob; name: string; type: string }>()

export async function uploadToBlob(file: File, path: string): Promise<string> {
  // Convert File to Blob
  const blob = new Blob([await file.arrayBuffer()], { type: file.type })

  // Store in our in-memory storage
  fileStorage.set(path, {
    data: blob,
    name: file.name,
    type: file.type,
  })

  // Return a simulated URL
  return `/api/files/${path}`
}

export async function getFileFromBlob(path: string) {
  const key = path.replace("/api/files/", "")
  return fileStorage.get(key)
}
