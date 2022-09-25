import { createBEM } from "@oly_op/bem";
import { createElement, FC } from "react";

import { useConfig } from "../../config-content";

import "./index.scss";

const bem = createBEM("Footer");

const Footer: FC = () => {
	const config = useConfig();
	return (
		<div className={bem("", "FlexColumnCenter")}>
			<p className="ParagraphTwo">{config.footer.createdBy.text}</p>
			<a
				href={config.footer.createdBy.link.url}
				className="Link ParagraphTwo"
				rel="noreferrer"
				target="_blank"
				title={config.footer.createdBy.link.text}
			>
				{config.footer.createdBy.link.text}
			</a>
		</div>
	);
};

export default Footer;
