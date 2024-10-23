import { NextRequest, NextResponse } from "next/server";
import Resource from "@/models/note.model";
import { connect } from "@/config/dbConnect";
import { isAuthenticated } from "@/lib/Auth";

// Establish database connection before handling the request
connect();

export async function DELETE(request: NextRequest) {
  try {
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
    const getId = searchParams.get("id");

    if (!getId) {
      return NextResponse.json(
        {
          error: "Notes id required",
        },
        {
          status: 404,
        }
      );
    }

    await Resource.findByIdAndDelete(getId);
    return NextResponse.json(
      {
        success: true,
        message: "Notes deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle errors and return a failure response
    return NextResponse.json(
      {
        success: false,
        message: `Failed to add resource: ${error.message}`,
      },
      { status: 400 }
    );
  }
}
