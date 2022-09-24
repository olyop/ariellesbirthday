import { useEffect, useState, createElement, FC, Fragment, ReactNode } from "react";

const Window: FC<PropTypes> = ({ children }) => {
	const [dimensions, setDimensions] = useState<Dimensions>({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () =>
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});

		window.addEventListener("resize", handleResize);

		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return <Fragment>{children(dimensions)}</Fragment>;
};

interface Dimensions {
	width: number;
	height: number;
}

interface PropTypes {
	children: (dimensions: Dimensions) => ReactNode;
}

export default Window;
