import { BEMInput, createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { ChangeEventHandler, createElement, FC, Fragment, PropsWithChildren } from "react";

import "@oly_op/css-utilities/index.css";
// eslint-disable-next-line import/extensions, import/no-unresolved
import "@oly_op/react-button/index.css";
import "../../index.scss";

import "./index.scss";

const bem = createBEM("Input");

export const enum InputType {
	TEXT,
	SELECT,
	TEXTAREA,
}

const Input: FC<PropsWithChildren<InputPropTypes>> = props => {
	const {
		name,
		type,
		value,
		inputID,
		onChange,
		children,
		tabIndex,
		disabled,
		maxLength,
		className,
		placeholder,
		selectOptions,
		labelClassName,
		inputClassName,
	} = props;

	const handleChange: ChangeEventHandler<
		HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
	> = event => {
		onChange(event.target.value);
	};

	if (type !== InputType.SELECT && !maxLength) {
		throw new TypeError("For input of type text or textarea `maxLength` must be defined ");
	}

	if (type === InputType.SELECT && !selectOptions) {
		throw new TypeError("For input of type select `selectOptions` must be defined ");
	}

	return (
		<div className={bem(className, type === InputType.SELECT && "root-select", "")}>
			<label
				htmlFor={inputID}
				className={bem(labelClassName, type === InputType.SELECT && "label-select", "label")}
			>
				{name}
			</label>
			{type === InputType.TEXT && (
				<input
					type="text"
					id={inputID}
					name={inputID}
					disabled={disabled}
					tabIndex={tabIndex}
					maxLength={maxLength}
					onChange={handleChange}
					placeholder={placeholder}
					value={value === null ? undefined : value}
					className={bem(inputClassName, "input")}
				/>
			)}
			{type === InputType.SELECT && selectOptions && (
				<Fragment>
					<select
						value={value}
						onChange={handleChange}
						className={bem(inputClassName, "select", "input")}
					>
						{selectOptions.map(option => (
							<option key={option} value={option} className={bem("select-option")}>
								{option}
							</option>
						))}
					</select>
					<Button
						transparent
						isHTMLButton
						title="Open"
						icon="expand_more"
						className={bem("select-open")}
						iconClassName={bem("select-open-icon")}
					/>
				</Fragment>
			)}
			{type === InputType.TEXTAREA && (
				<textarea
					id={inputID}
					name={inputID}
					disabled={disabled}
					tabIndex={tabIndex}
					maxLength={maxLength}
					onChange={handleChange}
					placeholder={placeholder}
					className={bem(inputClassName, "input")}
					value={value === null ? undefined : value}
				/>
			)}
			{children}
		</div>
	);
};

export type InputChange = (value: string) => void;

interface InputID {
	inputID: string;
}

interface ClassNamePropTypes {
	className?: BEMInput;
	labelClassName?: BEMInput;
	inputClassName?: BEMInput;
}

export interface InputPropTypes extends InputID, ClassNamePropTypes {
	name: string;
	value: string;
	type: InputType;
	tabIndex: number;
	onChange: InputChange;
	maxLength?: number;
	disabled?: boolean;
	placeholder?: string;
	selectOptions?: string[];
}

export default Input;
