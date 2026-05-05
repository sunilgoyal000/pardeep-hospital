import { NextResponse } from "next/server";
import { withRole } from "@/server/middleware/withRole";
import { toErrorResponse } from "@/server/errors";
import { ROLES } from "@/shared/constants/roles";
import { appointmentsService } from "@/modules/appointments/service";
import {
  CreateAppointmentSchema,
  ListAppointmentsQuerySchema,
} from "@/modules/appointments/schema";

export const GET = withRole(
  [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT],
  async (req, { user }) => {
    try {
      const params = Object.fromEntries(new URL(req.url).searchParams);
      const query = ListAppointmentsQuerySchema.parse(params);
      const data = await appointmentsService.list(user, query);
      return NextResponse.json({ data });
    } catch (err) {
      return toErrorResponse(err);
    }
  }
);

export const POST = withRole(
  [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PATIENT],
  async (req, { user, request }) => {
    try {
      const body = CreateAppointmentSchema.parse(await req.json());
      const data = await appointmentsService.create(user, body, request);
      return NextResponse.json({ data }, { status: 201 });
    } catch (err) {
      return toErrorResponse(err);
    }
  }
);
