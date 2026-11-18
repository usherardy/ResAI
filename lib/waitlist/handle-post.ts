import { siteConfig } from "@/lib/site";
import { getClientIp, isSameOrigin, readJsonBody } from "@/lib/security/request";
import type { ServiceDeps, ServiceResult } from "./service";

type Handler = (
  raw: unknown,
  context: { clientIp: string | null },
  deps: ServiceDeps,
) => Promise<ServiceResult>;

const noStore = { "Cache-Control": "no-store" };

/** Shared request guards for the waitlist and opt-out routes. */
export async function handleJsonPost(
  request: Request,
  handler: Handler,
  getDeps: () => ServiceDeps,
): Promise<Response> {
  if (!isSameOrigin(request, [siteConfig.url])) {
    return Response.json(
      { ok: false, error: "bad_request", message: "Cross-site requests aren't allowed." },
      { status: 403, headers: noStore },
    );
  }

  const body = await readJsonBody(request);
  if (!body.ok) {
    return Response.json(
      { ok: false, error: "bad_request", message: body.message },
      { status: body.status, headers: noStore },
    );
  }

  const result = await handler(
    body.value,
    { clientIp: getClientIp(request.headers) },
    getDeps(),
  );
  return Response.json(result.body, { status: result.status, headers: noStore });
}
