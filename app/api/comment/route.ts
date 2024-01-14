import { authOptions } from "@/app/lib/auth";
import { client } from "@/app/lib/prismaClient";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const include = {
  user: true,
  post: true,
  nestedComments: {
    include: {
      user: true,
    },
  },
};

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        {
          message: "Not exist post id.",
        },
        {
          status: 400,
        }
      );
    }

    const comments = await client.comment.findMany({
      where: {
        postId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include,
    });

    return NextResponse.json(comments);
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

export const POST = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    const { content, postId } = await request.json();

    if (!content || !postId) {
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

    const comment = await client.comment.create({
      data: {
        content,
        userId: session.user.id,
        postId,
      },
      include,
    });

    return NextResponse.json(comment);
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
