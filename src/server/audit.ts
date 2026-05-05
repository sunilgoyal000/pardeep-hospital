import { prisma } from "@/server/db";
import { logger } from "@/server/logger";
import type { SessionUser } from "@/shared/types/auth";
import type { RequestContext } from "@/server/requestContext";

interface RecordArgs {
  actor: SessionUser;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  context?: RequestContext;
}

// Best-effort audit write. Never throws — a failed audit must not break the
// caller's transaction. ip/userAgent are populated when a RequestContext is
// supplied (route handlers do this via fromRequest()).
export async function recordAudit({ actor, action, entity, entityId, metadata, context }: RecordArgs) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: actor.id,
        action,
        entity,
        entityId,
        metadata: metadata as never,
        ip: context?.ip,
        userAgent: context?.userAgent,
      },
    });
  } catch (err) {
    logger.error({ err, action, entity, entityId }, "audit write failed");
  }
}
