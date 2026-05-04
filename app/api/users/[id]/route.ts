import { NextResponse } from "next/server";
import { withRole } from "@/server/middleware/withRole";
import { toErrorResponse } from "@/server/errors";
import { ROLES } from "@/shared/constants/roles";
import { usersService } from "@/modules/users/service";
import { UpdateUserSchema } from "@/modules/users/schema";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = withRole<Ctx>(
  [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  async (req, { user, params }) => {
    try {
      const { id } = await params;
      const body = UpdateUserSchema.parse(await req.json());
      const data = await usersService.update(user, id, body);
      return NextResponse.json({ data });
    } catch (err) {
      return toErrorResponse(err);
    }
  }
);
