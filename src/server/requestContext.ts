import type { NextRequest } from "next/server";

export interface RequestContext {
  ip?: string;
  userAgent?: string;
}

const MAX_UA_LEN = 512;

export function fromRequest(req: NextRequest | Request): RequestContext {
  const h = req.headers;
  const fwd = h.get("x-forwarded-for");
  const ip = fwd?.split(",")[0].trim() || h.get("x-real-ip") || undefined;
  const ua = h.get("user-agent")?.slice(0, MAX_UA_LEN) || undefined;
  return { ip, userAgent: ua };
}
