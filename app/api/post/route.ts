import { authOptions } from "@/app/lib/auth";
import { client } from "@/app/lib/prismaClient";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");

    if (!page || isNaN(+page)) {
      return NextResponse.json(
        {
          message: "Not exist page.",
        },
        {
          status: 400,
        }
      );
    }

    const posts = await client.post.findMany({
      where: {
        NOT: {
          content: null,
        },
      },
      skip: (+page - 1) * 10,
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        comments: true,
        likes: true,
      },
    });

    return NextResponse.json(posts);
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

    if (!content) {
      return NextResponse.json(
        {
          message: "Not exist content.",
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

    const post = await client.post.upsert({
      where: {
        id: postId || "",
      },
      create: {
        content,
        userId: session.user.id,
      },
      update: {
        content,
      },
    });

    return NextResponse.json(post);
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
