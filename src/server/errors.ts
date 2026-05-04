import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "@/server/logger";

export type AppErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL";

const STATUS_BY_CODE: Record<AppErrorCode, number> = {
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION: 422,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL: 500,
};

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: AppErrorCode, message?: string, details?: unknown) {
    super(message ?? code);
    this.code = code;
    this.status = STATUS_BY_CODE[code];
    this.details = details;
  }
}

export function toErrorResponse(err: unknown): NextResponse {
  if (err instanceof AppError) {
    return NextResponse.json(
      { error: err.code, message: err.message, details: err.details },
      { status: err.status }
    );
  }
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: "VALIDATION", message: "Invalid input", details: err.flatten() },
      { status: 422 }
    );
  }
  logger.error({ err }, "Unhandled error in route handler");
  return NextResponse.json(
    { error: "INTERNAL", message: "Internal server error" },
    { status: 500 }
  );
}
