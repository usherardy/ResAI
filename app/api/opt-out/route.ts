import { getServiceDeps } from "@/lib/waitlist/deps";
import { handleJsonPost } from "@/lib/waitlist/handle-post";
import { submitOptOut } from "@/lib/waitlist/service";

export async function POST(request: Request) {
  return handleJsonPost(request, submitOptOut, getServiceDeps);
}
