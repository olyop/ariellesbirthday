import {
	S3,
	PutObjectCommand,
	ListObjectsV2Command,
	DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

import mime from "mime";
import path from "node:path";
import readdirp from "readdirp";
import { readFile } from "node:fs/promises";

console.log("Starting");

const BUILD_PATH = path.resolve(process.cwd(), "build");

const Bucket = process.env.AWS_S3_BUCKET_NAME;

const s3 = new S3({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
	},
});

console.log("Getting current s3 objects");

const listObjectsOutput = await s3.send(
	new ListObjectsV2Command({
		Bucket,
	}),
);

if (listObjectsOutput.Contents) {
	console.log("Deleting current s3 objects");

	await s3.send(
		new DeleteObjectsCommand({
			Bucket,
			Delete: {
				Objects: listObjectsOutput.Contents.map(({ Key }) => ({ Key })),
			},
		}),
	);
}

const uploadFile = async (Key: string) => {
	const filePath = path.join(BUILD_PATH, Key);
	console.log(`Uploading file to s3: ${filePath}`);
	const Body = await readFile(filePath);
	const ContentType = mime.getType(filePath);
	if (ContentType) {
		await s3.send(
			new PutObjectCommand({
				Key,
				Body,
				Bucket,
				ContentType,
			}),
		);
	}
};

console.log("Uploading build files");

for await (const entry of readdirp(BUILD_PATH)) {
	await uploadFile(entry.path);
}
