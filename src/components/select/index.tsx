// import { createBEM } from "@oly_op/bem";
// import Button from "@oly_op/react-button";
// import { ChangeEventHandler, createElement, FC, Fragment, useState } from "react";

// import Input, { InputPropTypes } from "../input";

// import "./index.scss";

// const bem = createBEM("Select");

// const Select: FC<PropTypes> = ({
// 	name,
// 	value,
// 	inputID,
// 	options,
// 	onChange,
// 	children,
// 	className,
// 	...inputPropTypes
// }) => {
// 	const [open, setOpen] = useState(false);

// 	const handleOpen = () => {
// 		if (!open) {
// 			setOpen(prevState => !prevState);
// 		}
// 	};

// 	const handleSelect = (selectedValue: string) => () => {
// 		if (onChange) {
// 			setOpen(false);
// 			onChange(selectedValue);
// 		}
// 	};

// 	const handleSelectChange: ChangeEventHandler<HTMLSelectElement> = event => {
// 		handleSelect(event.target.value)();
// 	};

// 	return (
// 		<Input
// 			disabled
// 			name={name}
// 			value={value}
// 			inputID={inputID}
// 			onClick={handleOpen}
// 			inputClassName={bem("input")}
// 			className={bem(className, "")}
// 			children={

// 			}
// 			{...inputPropTypes}
// 		/>
// 	);
// };

// interface PropTypes extends Omit<InputPropTypes, "value"> {
// 	value: string;
// 	options: readonly string[];
// }

// export default Select;
