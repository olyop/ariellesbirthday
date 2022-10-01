type TrueFalse = "true" | "false";

type NodeENV = "development" | "production";

declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: NodeENV;

		HOST: string;
		PORT: string;

		HTTPS: TrueFalse;
		TLS_CERTIFICATE_PATH: string;
		TLS_CERTIFICATE_KEY_PATH: string;

		AWS_REGION: string;
		AWS_ACCESS_KEY_ID: string;
		AWS_ACCESS_KEY_SECRET: string;

		AWS_S3_BUCKET_NAME: string;

		GOOGLE_MAPS_API_KEY: string;

		GOOGLE_RECAPTCHA_SITE_KEY: string;
		GOOGLE_RECAPTCHA_SECRET_KEY: string;

		ALGOLIA_SEARCH_INDEX_NAME: string;
		ALGOLIA_APPLICATION_ID: string;
		ALGOLIA_ADMIN_API_KEY: string;
	}
}
