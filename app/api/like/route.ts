import { authOptions } from "@/app/lib/auth";
import { client } from "@/app/lib/prismaClient";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    const { postId } = await request.json();

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

    const existLike = await client.like.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    if (existLike) {
      return NextResponse.json(
        {
          message: "Already like exist.",
        },
        {
          status: 400,
        }
      );
    }

    const like = await client.like.create({
      data: {
        userId: session.user.id,
        postId,
      },
      include: {
        user: true,
        post: true,
      },
    });

    return NextResponse.json(like);
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

export const DELETE = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    const { postId } = await request.json();

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

    const like = await client.like.findFirst({
      where: {
        postId,
        userId: session.user.id,
      },
    });

    if (!like) {
      return NextResponse.json(
        {
          message: "Not exist like.",
        },
        {
          status: 400,
        }
      );
    }

    await client.like.delete({
      where: {
        id: like.id,
      },
    });

    return NextResponse.json({ message: "Successfully deleted." });
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
