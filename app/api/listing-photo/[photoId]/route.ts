import { getSavedAutoTraderPhoto } from "@/lib/listing-photo";

export const runtime = "edge";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const { photoId } = await params;
  const object = await getSavedAutoTraderPhoto(photoId);
  if (!object) return new Response("Photo not found", { status: 404 });
  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
      "Cache-Control": object.httpMetadata?.cacheControl ?? "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
