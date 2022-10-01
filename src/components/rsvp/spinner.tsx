import { createElement, FC } from "react";

const Spinner: FC = () => (
	<svg className="Spinner" viewBox="0 0 50 50">
		<circle className="Spinner__path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
	</svg>
);

export default Spinner;
