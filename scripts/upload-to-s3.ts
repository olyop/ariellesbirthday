import {
	S3,
	PutObjectCommand,
	ListObjectsV2Command,
	DeleteObjectsCommand,
} from "@aws-sdk/client-s3"

import mime from "mime"
import path from "node:path"
import fs from "node:fs/promises"

console.log("Starting")

const BUILD_PATH =
	path.resolve(process.cwd(), "build")

const Bucket =
	process.env.AWS_S3_BUCKET_NAME

const s3 =
	new S3({
		region: process.env.AWS_REGION,
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
		},
	})

console.log("Getting current objects")

const listObjectsOutput =
	await s3.send(
		new ListObjectsV2Command({
			Bucket,
		}),
	)

if (listObjectsOutput.Contents) {
	console.log("Deleting current files")

	await s3.send(
		new DeleteObjectsCommand({
			Bucket,
			Delete: {
				Objects:
					listObjectsOutput.Contents
						.map(({ Key }) => ({ Key })),
			},
		}),
	)
}

console.log("Reading build files")

const files =
	await fs.readdir(BUILD_PATH)

console.log("Uploading build files")

for (const Key of files) {
	const filePath = path.join(BUILD_PATH, Key)
	console.log(`Uploading file: ${filePath}`)
	const Body = await fs.readFile(filePath)
	const ContentType = mime.getType(filePath)
	if (ContentType) {
		await s3.send(
			new PutObjectCommand({
				Key,
				Body,
				Bucket,
				ContentType,
			}),
		)
	}
}