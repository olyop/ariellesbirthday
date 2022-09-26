import { BEMInput, createBEM } from "@oly_op/bem";
import { createElement, FC, PropsWithChildren } from "react";

const bem = createBEM("Section");

const Section: FC<PropsWithChildren<PropTypes>> = ({
	id,
	className,
	contentClassName,
	children,
}) => (
	<section id={id} className={bem(className, "PaddingTopBottomHalf")}>
		<div className={bem(contentClassName, "Content")}>{children}</div>
	</section>
);

interface PropTypes {
	id: string;
	className?: BEMInput;
	contentClassName?: BEMInput;
}

export default Section;
