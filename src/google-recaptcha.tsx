import { createElement, FC, PropsWithChildren } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const ReCaptcha: FC<PropsWithChildren> = ({ children }) => (
	<GoogleReCaptchaProvider reCaptchaKey={process.env.GOOGLE_RECAPTCHA_SITE_KEY}>
		{children}
	</GoogleReCaptchaProvider>
);

export default ReCaptcha;
