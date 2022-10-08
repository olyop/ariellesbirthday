import mime from "mime";
import limit from "p-limit";
import path from "node:path";
import readdirp from "readdirp";
import fs, { ReadStream } from "node:fs";
import {
	S3,
	PutObjectCommand,
	ListObjectsV2Command,
	DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

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

const uploadToS3 = async (key: string, Body: ReadStream) => {
	try {
		const contentType = mime.getType(path.extname(key));
		if (contentType) {
			console.log(`${key} (${contentType})`);
			await s3.send(
				new PutObjectCommand({
					Body,
					Bucket,
					Key: key,
					ContentType: contentType,
				}),
			);
		} else {
			throw new TypeError("Invalid mime type");
		}
	} catch (error: unknown) {
		console.error(error);
	}
};

const promiseLimitter = limit(200);
const files = await readdirp.promise(BUILD_PATH);

const uploadToS3Thunk = (key: string, fullPath: string) =>
	uploadToS3(key, fs.createReadStream(fullPath));

console.log("Uploading files...");

await Promise.all(
	files.map(({ path: fileName, fullPath }) => promiseLimitter(uploadToS3Thunk, fileName, fullPath)),
);

console.log("Done");
