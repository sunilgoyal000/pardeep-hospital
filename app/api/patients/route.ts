import { NextResponse } from "next/server";
import { withRole } from "@/server/middleware/withRole";
import { toErrorResponse } from "@/server/errors";
import { ROLES } from "@/shared/constants/roles";
import { patientsService } from "@/modules/patients/service";
import { ListPatientsQuerySchema } from "@/modules/patients/schema";

export const GET = withRole(
  [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DOCTOR],
  async (req, { user }) => {
    try {
      const params = Object.fromEntries(new URL(req.url).searchParams);
      const query = ListPatientsQuerySchema.parse(params);
      const data = await patientsService.list(user, query);
      return NextResponse.json({ data });
    } catch (err) {
      return toErrorResponse(err);
    }
  }
);
