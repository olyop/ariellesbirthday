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
					src="/arielle-cover-cow.jpg"
					className={bem("images-cover-cow", "images-cover")}
				/>
				<img
					alt="Arielle Cover River"
					src="/arielle-cover-river.jpg"
					className={bem("images-cover-river", "images-cover")}
				/>
				<img
					alt="Arielle Cover Climbing"
					src="/arielle-cover-climbing.jpg"
					className={bem("images-cover-climbing", "images-cover")}
				/>
				<img
					alt="Arielle Cover Pancakes"
					src="/instagram-pancakes.jpg"
					className={bem("images-cover-pancakes", "images-cover")}
				/>
				<img
					alt="Arielle with Shiba"
					src="/arielle-shiba.jpg"
					className={bem("images-cover-shiba", "images-cover")}
				/>
			</div>
		</div>
	</section>
);

export default Cover;
