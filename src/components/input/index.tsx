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
	onClick,
	onChange,
	children,
	className,
	disabled,
	tabIndex,
	placeholder,
	inputClassName,
	isTextArea = false,
}) => {
	const handleInputChange: ChangeEventHandler<HTMLInputElement> = event => {
		if (onChange) {
			onChange(event.target.value);
		}
	};
	const handleTextAreaChange: ChangeEventHandler<HTMLTextAreaElement> = event => {
		if (onChange) {
			onChange(event.target.value);
		}
	};
	return (
		<div
			className={bem(className, "")}
			onClick={onClick}
			role="button"
			tabIndex={tabIndex}
			onKeyDown={onClick}
		>
			<label htmlFor={inputID} className={bem("label")}>
				{name}
			</label>
			{isTextArea ? (
				<textarea
					id={inputID}
					name={inputID}
					tabIndex={tabIndex}
					disabled={disabled}
					placeholder={placeholder}
					className={bem(inputClassName, "input")}
					onChange={onClick ? undefined : handleTextAreaChange}
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
					className={bem(inputClassName, "input")}
					onChange={onClick ? undefined : handleInputChange}
					value={value === null ? undefined : typeof value === "string" ? value : undefined}
				/>
			)}
			{children}
		</div>
	);
};

type HTMLInputPropTypes = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"name" | "value" | "tabIndex" | "onChange" | "onClick" | "className"
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
	className?: BEMInput;
	onClick?: () => void;
	onChange?: InputChange;
	inputClassName?: BEMInput;
}

export default Input;
