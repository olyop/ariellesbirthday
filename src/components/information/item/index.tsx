import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { createElement, ReactEventHandler, FC, Fragment, HTMLAttributes } from "react";

import Window from "../../window";
import { useConfig } from "../../../config-content";

import "./index.scss";

const bem = createBEM("InformationItem");

const InformationItem: FC<PropTypes> = ({ name, label, tabIndex, onSelect, isExpanded }) => {
	const config = useConfig();
	const expandFull = config.information.expandText.full;
	const expandSmall = config.information.expandText.small;
	return (
		<button
			type="button"
			onClick={onSelect}
			onFocus={onSelect}
			title={expandFull}
			tabIndex={tabIndex}
			className={bem(isExpanded && "expanded", "", "ParagraphOne")}
		>
			<span className={bem("text-left", "text")}>{name}</span>
			<Window>
				{({ width }) =>
					width > 1000 && (
						<Fragment>
							<span className={bem("divider")} />
							<span className={bem("text")}>{label}</span>
						</Fragment>
					)
				}
			</Window>
			<Button
				transparent
				isHTMLButton={false}
				className={bem("more")}
				rightIcon="arrow_forward_ios"
				childrenClassName={bem("more-children")}
				text={<Window>{({ width }) => (width > 1400 ? expandFull : expandSmall)}</Window>}
			/>
		</button>
	);
};

interface PropTypes extends Pick<HTMLAttributes<HTMLInputElement>, "tabIndex"> {
	name: string;
	label: string;
	isExpanded: boolean;
	onSelect: ReactEventHandler<HTMLButtonElement>;
}

export default InformationItem;
