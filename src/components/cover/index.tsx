import { createBEM } from "@oly_op/bem";
import { createElement, FC } from "react";

import "./index.scss";

const bem = createBEM("Cover");

const Cover: FC = () => (
	<section className={bem("")}>
		<div className="Content">
			<div className={bem("images")}>
				<img
					alt="Arielle Cover Cow"
					src="/images/arielle-cover-cow.jpg"
					className={bem("images-cover-cow", "images-cover")}
				/>
				<img
					alt="Arielle Cover River"
					src="/images/arielle-cover-river.jpg"
					className={bem("images-cover-river", "images-cover")}
				/>
				<img
					alt="Arielle Cover Climbing"
					src="/images/arielle-cover-climbing.jpg"
					className={bem("images-cover-climbing", "images-cover")}
				/>
				<img
					alt="Arielle Cover Donuts"
					src="/images/arielle-cover-donuts.jpg"
					className={bem("images-cover-donuts", "images-cover")}
				/>
			</div>
		</div>
	</section>
);

export default Cover;
