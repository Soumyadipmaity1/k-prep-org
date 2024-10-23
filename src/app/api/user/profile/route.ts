import { connect } from "@/config/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { isAuthenticated } from "@/lib/Auth";

connect();

export async function GET(request: NextRequest) {
  const status = await isAuthenticated(request);
  if (!status) {
    return NextResponse.json(
      {
        message: "Unauthorized user",
      },
      {
        status: 401,
      }
    );
  }
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  try {
    if (!email) {
      return NextResponse.json(
        {
          success: true,
          message: "Invalid Credentials",
        },
        {
          status: 409,
        }
      );
    } else {
      const user = await User.findOne({ email }).select("-password");
      return NextResponse.json(
        {
          success: true,
          user,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error, please try again.",
      },
      {
        status: 500,
      }
    );
  }
}
