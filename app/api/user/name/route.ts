import { authOptions } from "@/app/lib/auth";
import { client } from "@/app/lib/prismaClient";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        {
          message: "Not exist name.",
        },
        {
          status: 400,
        }
      );
    }

    if (!session) {
      return NextResponse.json(
        {
          message: "Wrong session.",
        },
        {
          status: 400,
        }
      );
    }

    await client.user.update({
      where: {
        id: session?.user.id,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(name);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: error,
      },
      { status: 500 }
    );
  }
};
