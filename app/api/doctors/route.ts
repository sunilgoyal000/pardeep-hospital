import { NextResponse } from "next/server";
import { withAuth } from "@/server/middleware/withRole";
import { toErrorResponse } from "@/server/errors";
import { doctorsService } from "@/modules/doctors/service";
import { ListDoctorsQuerySchema } from "@/modules/doctors/schema";

export const GET = withAuth(async (req, { user }) => {
  try {
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const query = ListDoctorsQuerySchema.parse(params);
    const data = await doctorsService.list(user, query);
    return NextResponse.json({ data });
  } catch (err) {
    return toErrorResponse(err);
  }
});
