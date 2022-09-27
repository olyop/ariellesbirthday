import { BEMInput, createBEM } from "@oly_op/bem";
import {
	FC,
	createElement,
	ChangeEventHandler,
	InputHTMLAttributes,
	PropsWithChildren,
} from "react";

import "./index.scss";

const bem = createBEM("Input");

const Input: FC<PropsWithChildren<InputPropTypes>> = ({
	name,
	value,
	inputID,
	onChange,
	children,
	isTextArea = false,
	className,
	inputClassName,
	tabIndex,
	placeholder,
	disabled,
}) => {
	const handleInputChange: ChangeEventHandler<HTMLInputElement> = event => {
		onChange(event.target.value);
	};
	const handleTextAreaChange: ChangeEventHandler<HTMLTextAreaElement> = event => {
		onChange(event.target.value);
	};
	return (
		<div className={bem(className, "")}>
			<label children={name} htmlFor={inputID} className={bem("label")} />
			{isTextArea ? (
				<textarea
					rows={3}
					id={inputID}
					name={inputID}
					tabIndex={tabIndex}
					disabled={disabled}
					placeholder={placeholder}
					onChange={handleTextAreaChange}
					className={bem(inputClassName, "input")}
					value={value === null ? undefined : typeof value === "string" ? value : undefined}
				/>
			) : (
				<input
					type="text"
					id={inputID}
					name={inputID}
					tabIndex={tabIndex}
					disabled={disabled}
					placeholder={placeholder}
					onChange={handleInputChange}
					className={bem(inputClassName, "input")}
					value={value === null ? undefined : typeof value === "string" ? value : undefined}
				/>
			)}
			{children}
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

export interface InputPropTypes extends InputID, HTMLInputPropTypes {
	name: string;
	value: string;
	tabIndex: number;
	isTextArea?: boolean;
	onChange: InputChange;
	className?: BEMInput;
	inputClassName?: BEMInput;
}

export default Input;
