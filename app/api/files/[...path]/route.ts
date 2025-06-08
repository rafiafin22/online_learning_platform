import { type NextRequest, NextResponse } from "next/server"
import { getFileFromBlob } from "@/lib/storage"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")
    const file = await getFileFromBlob(path)

    if (!file) {
      return new NextResponse("File not found", { status: 404 })
    }

    // Convert Blob to ArrayBuffer
    const arrayBuffer = await file.data.arrayBuffer()

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": file.type,
        "Content-Disposition": `inline; filename="${file.name}"`,
      },
    })
  } catch (error) {
    console.error("Error serving file:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
