import { createBEM } from "@oly_op/bem";
import { createElement, FC } from "react";

import Section from "../section";

import "./index.scss";

const bem = createBEM("Cover");

const Cover: FC = () => (
	<Section id="cover" className={bem("")} contentClassName="Content">
		<div className={bem("images")}>
			<img
				src="/images/arielle-baby.jpg"
				alt="Arielle as a baby"
				title="Arielle being dirty"
				className={bem("images-cover-baby", "images-cover")}
			/>
			<img
				src="/images/arielle-river.jpg"
				alt="Arielle next to a river"
				title="Arielle somewhere near a river, probably overseas"
				className={bem("images-cover-river", "images-cover")}
			/>
			<img
				src="/images/arielle-asian.jpg"
				alt="Arielle in Asia"
				title="Arielle living life"
				className={bem("images-cover-asian", "images-cover")}
			/>
			<img
				src="/images/pancakes.jpg"
				alt="Arielle's pancakes"
				title="One of Arielles daily feasts"
				className={bem("images-cover-pancakes", "images-cover")}
			/>
			<img
				src="/images/arielle-shiba.jpg"
				alt="Arielle with Shiba"
				title="Arielle with her second favorite dog in the world"
				className={bem("images-cover-shiba", "images-cover")}
			/>
		</div>
	</Section>
);

export default Cover;
