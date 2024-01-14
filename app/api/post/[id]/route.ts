import { client } from "@/app/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    const post = await client.post.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        likes: true,
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
