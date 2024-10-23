import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function isAuthenticated(request:NextRequest) {
  const secret = process.env.TOKEN_SECRET!;
  const authorize = await getToken({ req: request, secret });
  return authorize;
}
