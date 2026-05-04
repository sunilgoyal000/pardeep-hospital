import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { AppError, toErrorResponse } from "@/server/errors";
import type { Role } from "@/shared/constants/roles";
import type { SessionUser } from "@/shared/types/auth";

type AuthedContext<C> = C & { user: SessionUser };

type Handler<C> = (
  req: NextRequest,
  ctx: AuthedContext<C>
) => Promise<NextResponse> | NextResponse;

/**
 * RBAC wrapper for App Router route handlers.
 *
 * Authentication is enforced here, but resource-level authorization
 * (ownership checks, etc.) MUST still happen in the service layer.
 * Middleware alone does not prevent IDOR.
 */
export function withRole<C extends object = object>(
  allowed: Role[],
  handler: Handler<C>
) {
  return async (req: NextRequest, ctx: C): Promise<NextResponse> => {
    try {
      const session = await auth();
      if (!session?.user?.id) {
        throw new AppError("UNAUTHENTICATED");
      }
      if (!allowed.includes(session.user.role)) {
        throw new AppError("FORBIDDEN");
      }
      const user: SessionUser = {
        id: session.user.id,
        email: session.user.email ?? "",
        name: session.user.name ?? null,
        role: session.user.role,
      };
      return await handler(req, { ...(ctx ?? ({} as C)), user });
    } catch (err) {
      return toErrorResponse(err);
    }
  };
}

export function withAuth<C extends object = object>(handler: Handler<C>) {
  return withRole<C>(
    ["SUPER_ADMIN", "ADMIN", "DOCTOR", "PATIENT", "PHARMACY", "LAB"],
    handler
  );
}
