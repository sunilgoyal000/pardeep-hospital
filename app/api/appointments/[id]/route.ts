import { NextResponse } from "next/server";
import { withRole } from "@/server/middleware/withRole";
import { toErrorResponse } from "@/server/errors";
import { ROLES } from "@/shared/constants/roles";
import { appointmentsService } from "@/modules/appointments/service";
import { UpdateAppointmentSchema } from "@/modules/appointments/schema";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withRole<Ctx>(
  [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT],
  async (_req, { user, params }) => {
    try {
      const { id } = await params;
      const data = await appointmentsService.getById(user, id);
      return NextResponse.json({ data });
    } catch (err) {
      return toErrorResponse(err);
    }
  }
);

export const PATCH = withRole<Ctx>(
  [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT],
  async (req, { user, params }) => {
    try {
      const { id } = await params;
      const body = UpdateAppointmentSchema.parse(await req.json());
      const data = await appointmentsService.update(user, id, body);
      return NextResponse.json({ data });
    } catch (err) {
      return toErrorResponse(err);
    }
  }
);

export const DELETE = withRole<Ctx>(
  [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PATIENT],
  async (_req, { user, params }) => {
    try {
      const { id } = await params;
      const data = await appointmentsService.cancel(user, id);
      return NextResponse.json({ data });
    } catch (err) {
      return toErrorResponse(err);
    }
  }
);
