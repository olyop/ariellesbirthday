import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { ChangeEventHandler, createElement, FC, Fragment, useState } from "react";

import Window from "../window";
import Input, { InputPropTypes } from "../input";

import "./index.scss";

const bem = createBEM("Select");

const Select: FC<PropTypes> = ({
	name,
	value,
	inputID,
	options,
	onChange,
	children,
	className,
	...inputPropTypes
}) => {
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		if (!open) {
			setOpen(prevState => !prevState);
		}
	};

	const handleSelect = (selectedValue: string) => () => {
		if (onChange) {
			console.log("!");
			setOpen(false);
			onChange(selectedValue);
		}
	};

	const handleSelectChange: ChangeEventHandler<HTMLSelectElement> = event => {
		handleSelect(event.target.value)();
	};

	return (
		<Input
			disabled
			name={name}
			value={value}
			inputID={inputID}
			onClick={handleOpen}
			inputClassName={bem("input")}
			className={bem(className, "")}
			children={
				<Window>
					{({ width }) =>
						width < 800 ? (
							<select className={bem("input-select")} onChange={handleSelectChange}>
								{options.map(option => (
									<option key={option} className="ParagraphOne" value={option}>
										{option}
									</option>
								))}
							</select>
						) : (
							<Fragment>
								<Button
									transparent
									isHTMLButton
									title="Open"
									icon="expand_more"
									className={bem("input-open")}
									iconClassName={bem("input-open-icon")}
								/>
								{open && (
									<Fragment>
										<Button
											transparent
											isHTMLButton
											title="Open"
											icon="expand_more"
											className={bem("input-open")}
											iconClassName={bem("input-open-icon")}
										/>
										<div className={bem("input-options", "Rounded Elevated FlexColumn")}>
											{options.map((option, index) => (
												<button
													type="button"
													onClick={handleSelect(option)}
													className={bem("input-options-option", "PaddingHalf ParagraphOne")}
													key={option}
													tabIndex={index}
												>
													{option}
												</button>
											))}
										</div>
									</Fragment>
								)}
							</Fragment>
						)
					}
				</Window>
			}
			{...inputPropTypes}
		/>
	);
};

interface PropTypes extends Omit<InputPropTypes, "value"> {
	value: string;
	options: readonly string[];
}

export default Select;
