import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { createElement, FC } from "react";

import Input, { InputPropTypes } from "../input";

import "./index.scss";

const bem = createBEM("Select");

const Select: FC<PropTypes> = ({
	name,
	value,
	inputID,
	onChange,
	children,
	className,
	...inputPropTypes
}) => (
	<Input
		disabled
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		value={value[0]!}
		inputID={inputID}
		name={name}
		onChange={onChange}
		className={bem(className, "")}
		inputClassName={bem("input")}
		{...inputPropTypes}
	>
		<Button transparent isHTMLButton title="Open" icon="expand_more" className={bem("open")} />
	</Input>
);

interface PropTypes extends Omit<InputPropTypes, "value"> {
	value: string[];
}

export default Select;
