import { authOptions } from "@/app/lib/auth";
import { client } from "@/app/lib/prismaClient";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    const { content } = await request.json();
    const { id } = params;

    if (!content) {
      return NextResponse.json(
        {
          message: "Not exist data.",
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

    const nestedComment = await client.comment.create({
      data: {
        content,
        userId: session.user.id,
        parentCommentId: id,
      },
      include: {
        user: true,
        post: true,
      },
    });

    return NextResponse.json(nestedComment);
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
