import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const runtime = "nodejs";

// The form probes this on mount to decide whether to show the upload box.
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ enabled: !!process.env.BLOB_READ_WRITE_TOKEN });
}

// Client-side uploads (via @vercel/blob/client `upload()`) POST here to mint a
// short-lived token, so the file goes straight to Blob storage and never passes
// through the serverless body limit. Needs BLOB_READ_WRITE_TOKEN in the env
// (auto-added when you create a Blob store in the Vercel dashboard).
export async function POST(req: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "File uploads aren't set up yet. Please paste a link to your deck instead." },
      { status: 501 }
    );
  }

  const body = (await req.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      request: req,
      body,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "application/pdf",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/vnd.oasis.opendocument.presentation",
        ],
        maximumSizeInBytes: 25 * 1024 * 1024, // 25 MB
        addRandomSuffix: true,
      }),
      // no-op: we read the returned URL client-side and store it with the team
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 400 }
    );
  }
}
