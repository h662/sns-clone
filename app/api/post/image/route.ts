import { authOptions } from "@/app/lib/auth";
import { client } from "@/app/lib/prismaClient";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const imageFileName = searchParams.get("imageFileName");

    if (!imageFileName) {
      return NextResponse.json(
        {
          message: "Not exist image file name.",
        },
        {
          status: 400,
        }
      );
    }

    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: imageFileName,
    });

    const awsResponse = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 3600,
    });

    return NextResponse.json(awsResponse);
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
    const formData = await request.formData();
    const imageFile = formData.get("imageFile") as File | null;

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

    if (!imageFile) return;

    const fileExtension = imageFile.name.split(".").pop()?.toLowerCase();
    const uuid = uuidv4();
    const imageFileName = `${uuid}.${fileExtension}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: imageFileName,
      Body: Buffer.from(await imageFile.arrayBuffer()),
    });

    await s3Client.send(putObjectCommand);

    const post = await client.post.create({
      data: {
        image: imageFileName,
        userId: session.user.id,
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
