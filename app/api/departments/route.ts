import { NextResponse } from "next/server";
import { withAuth } from "@/server/middleware/withRole";
import { toErrorResponse } from "@/server/errors";
import { departmentsService } from "@/modules/departments/service";
import { ListDepartmentsQuerySchema } from "@/modules/departments/schema";

export const GET = withAuth(async (req, { user }) => {
  try {
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const query = ListDepartmentsQuerySchema.parse(params);
    const data = await departmentsService.list(user, query);
    return NextResponse.json({ data });
  } catch (err) {
    return toErrorResponse(err);
  }
});
