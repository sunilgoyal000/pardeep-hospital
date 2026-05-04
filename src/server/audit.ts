import { prisma } from "@/server/db";
import { logger } from "@/server/logger";
import type { SessionUser } from "@/shared/types/auth";

interface RecordArgs {
  actor: SessionUser;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

// Best-effort audit write. Never throws — a failed audit must not break the
// caller's transaction. Request-context fields (ip, userAgent) land in PR-5
// once we thread an explicit RequestContext through the service layer.
export async function recordAudit({ actor, action, entity, entityId, metadata }: RecordArgs) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: actor.id,
        action,
        entity,
        entityId,
        metadata: metadata as never,
      },
    });
  } catch (err) {
    logger.error({ err, action, entity, entityId }, "audit write failed");
  }
}
