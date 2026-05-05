import { NextResponse } from "next/server";
import { withRole } from "@/server/middleware/withRole";
import { toErrorResponse } from "@/server/errors";
import { ROLES } from "@/shared/constants/roles";
import { doctorsService } from "@/modules/doctors/service";
import { UpdateDoctorSchema } from "@/modules/doctors/schema";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = withRole<Ctx>(
  [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  async (req, { user, params, request }) => {
    try {
      const { id } = await params;
      const body = UpdateDoctorSchema.parse(await req.json());
      await doctorsService.update(user, id, body, request);
      return NextResponse.json({ ok: true });
    } catch (err) {
      return toErrorResponse(err);
    }
  }
);
