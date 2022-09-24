import { createRoot } from "react-dom/client";
import { createElement, StrictMode } from "react";

import Main from "./main";
import { Config } from "./providers";

const container = document.getElementById("Root");

if (container) {
	createRoot(container).render(
		<StrictMode>
			<Config>
				<Main />
			</Config>
		</StrictMode>,
	);
}
