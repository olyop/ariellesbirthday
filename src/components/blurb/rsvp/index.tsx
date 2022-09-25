/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { createElement, FC, Fragment, useState } from "react";

import { useConfig } from "../../../config-content";

import "./index.scss";

const bem = createBEM("RSVP");

const RSVP: FC = () => {
	const config = useConfig();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleModalOpen = () => {
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};
	return (
		<Fragment>
			<Button
				icon={config.rsvp.button.icon}
				text={config.rsvp.button.text}
				onClick={handleModalOpen}
			/>
			<div
				className={bem("modal")}
				style={isModalOpen ? { opacity: 1, visibility: "visible" } : undefined}
			>
				<div className={bem("modal-background")} onClick={handleModalClose} role="dialog" />
				<div
					className={bem("modal-content", "Padding FlexColumnGap")}
					style={isModalOpen ? { left: "50%" } : undefined}
				>
					<p className="ParagraphOne">RSVP</p>
					<div className={bem("modal-content-buttons")}>
						<Button text="Submit" icon="send" onClick={handleModalClose} />
						<Button transparent text="Close" icon="close" onClick={handleModalClose} />
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default RSVP;
