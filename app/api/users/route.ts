import { NextResponse } from "next/server";
import { withRole } from "@/server/middleware/withRole";
import { toErrorResponse } from "@/server/errors";
import { ROLES } from "@/shared/constants/roles";
import { usersService } from "@/modules/users/service";
import {
  CreateUserSchema,
  ListUsersQuerySchema,
} from "@/modules/users/schema";

export const GET = withRole(
  [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  async (req, { user }) => {
    try {
      const params = Object.fromEntries(new URL(req.url).searchParams);
      const query = ListUsersQuerySchema.parse(params);
      const data = await usersService.list(user, query);
      return NextResponse.json({ data });
    } catch (err) {
      return toErrorResponse(err);
    }
  }
);

export const POST = withRole(
  [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  async (req, { user }) => {
    try {
      const body = CreateUserSchema.parse(await req.json());
      const data = await usersService.create(user, body);
      return NextResponse.json({ data }, { status: 201 });
    } catch (err) {
      return toErrorResponse(err);
    }
  }
);
