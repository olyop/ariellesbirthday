import { BEMInput, createBEM } from "@oly_op/bem";
import { FC, createElement, ChangeEventHandler, InputHTMLAttributes } from "react";

import "./index.scss";

const bem = createBEM("Input");

const Input: FC<PropTypes> = ({ name, value, inputID, onChange, className, ...inputPropTypes }) => {
	const handleOnChange: ChangeEventHandler<HTMLInputElement> = event => {
		onChange(event.target.value);
	};
	return (
		<div className={bem(className, "")}>
			<label children={name} htmlFor={inputID} className={bem("label")} />
			<input
				type="text"
				id={inputID}
				name={inputID}
				onChange={handleOnChange}
				className={bem("input")}
				value={value === null ? undefined : typeof value === "string" ? value : undefined}
				{...inputPropTypes}
			/>
		</div>
	);
};

type HTMLInputPropTypes = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"name" | "value" | "tabIndex" | "onChange" | "className"
>;

interface InputID {
	inputID: string;
}

export type InputChange = (value: string) => void;

export interface PropTypes extends InputID, HTMLInputPropTypes {
	name: string;
	value: string;
	tabIndex: number;
	className?: BEMInput;
	onChange: InputChange;
}

export default Input;
