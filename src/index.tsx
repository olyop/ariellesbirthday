import { createRoot } from "react-dom/client";
import { createElement, StrictMode } from "react";

import Main from "./main";
import { Config } from "./providers";
import ReCaptcha from "./google-recaptcha";

const container = document.getElementById("Root");

if (container) {
	const root = createRoot(container);
	root.render(
		<StrictMode>
			<ReCaptcha>
				<Config>
					<Main />
				</Config>
			</ReCaptcha>
		</StrictMode>,
	);
}
