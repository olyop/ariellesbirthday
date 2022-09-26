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
			<p>
				<a
					href={config.footer.createdBy.website.url}
					className="Link ParagraphTwo"
					rel="noreferrer"
					target="_blank"
					title={config.footer.createdBy.website.text}
				>
					{config.footer.createdBy.website.text}
				</a>
				<span className="ParagraphTwo PaddingLeftRightQuart">-</span>
				<a
					href={config.footer.sourceCode.url}
					className="Link ParagraphTwo LowerCase"
					rel="noreferrer"
					target="_blank"
					title={config.footer.sourceCode.text}
				>
					{config.footer.sourceCode.text}
				</a>
			</p>
		</div>
	);
};

export default Footer;
