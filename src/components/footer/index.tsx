import { createBEM } from "@oly_op/bem";
import { createElement, FC } from "react";

import { useConfig } from "../../config-content";

import "./index.scss";

const bem = createBEM("Footer");

const Footer: FC = () => {
	const config = useConfig();
	return (
		<div className={bem("", "FlexColumnCenter")}>
			<p className="ParagraphTwo">{config.FOOTER.CREATED_BY.TEXT}</p>
			<a
				href={config.FOOTER.CREATED_BY.LINK.URL}
				className="Link ParagraphTwo"
				rel="noreferrer"
				target="_blank"
				title={config.FOOTER.CREATED_BY.LINK.TEXT}
			>
				{config.FOOTER.CREATED_BY.LINK.TEXT}
			</a>
		</div>
	);
};

export default Footer;
