import { createBEM } from "@oly_op/bem";
import { FC, Fragment, createElement } from "react";

import { useConfig } from "../../config-content";
import "./index.scss";

const bem = createBEM("Footer");

const Footer: FC = () => {
	const config = useConfig();
	return (
		<footer className={bem("", "FlexColumnCenter")}>
			<p className="ParagraphTwo">
				<Fragment>Created by </Fragment>
				<a
					href={config.footer.createdBy.website.url}
					className="Link ParagraphTwo"
					rel="noreferrer"
					target="_blank"
					title={config.footer.createdBy.website.text}
				>
					Oliver Plummer
				</a>
			</p>
			<p className="ParagraphTwo">
				<Fragment>Hosted on AWS using S3 and CloudFront</Fragment>
				<Fragment> — </Fragment>
				<a
					href="https://github.com/olyop/ariellesbirthday"
					className="Link LowerCase"
					rel="noreferrer"
					target="_blank"
					title="Source Code"
				>
					Source Code
				</a>
			</p>
		</footer>
	);
};

export default Footer;
