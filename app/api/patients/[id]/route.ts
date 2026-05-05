import { NextResponse } from "next/server";
import { withAuth, withRole } from "@/server/middleware/withRole";
import { toErrorResponse } from "@/server/errors";
import { ROLES } from "@/shared/constants/roles";
import { patientsService } from "@/modules/patients/service";
import { UpdatePatientSchema } from "@/modules/patients/schema";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withRole<Ctx>(
  [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DOCTOR],
  async (_req, { user, params }) => {
    try {
      const { id } = await params;
      const data = await patientsService.getById(user, id);
      return NextResponse.json({ data });
    } catch (err) {
      return toErrorResponse(err);
    }
  }
);

// Patient self-edit + staff edit; service enforces ownership for non-staff.
export const PATCH = withAuth<Ctx>(async (req, { user, params, request }) => {
  try {
    const { id } = await params;
    const body = UpdatePatientSchema.parse(await req.json());
    const data = await patientsService.update(user, id, body, request);
    return NextResponse.json({ data });
  } catch (err) {
    return toErrorResponse(err);
  }
});
