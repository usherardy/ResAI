import { getServiceDeps } from "@/lib/waitlist/deps";
import { handleJsonPost } from "@/lib/waitlist/handle-post";
import { submitWaitlist } from "@/lib/waitlist/service";

export async function POST(request: Request) {
  return handleJsonPost(request, submitWaitlist, getServiceDeps);
}
