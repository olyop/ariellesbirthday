import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { createElement, FC, Fragment, useState } from "react";

import Input, { InputChange } from "../input";
import { useConfig } from "../../config-content";

import "./index.scss";

const bem = createBEM("RSVP");

const NameInput: FC<{ value: string; onChange: InputChange }> = ({ value, onChange }) => (
	<Input
		name="name"
		inputID="name"
		tabIndex={0}
		value={value}
		onChange={onChange}
		placeholder="Name"
	/>
);

const RSVP: FC = () => {
	const config = useConfig();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [onNameForm, setOnNameForm] = useState(true);
	const [onAttendingForm, setOnAttendingForm] = useState(false);
	const [notAttendingForm, setNotAttendingForm] = useState(false);

	const [name, setName] = useState("");
	const [attending, setAttending] = useState(false);

	const handleModalOpen = () => {
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setOnNameForm(true);
		setOnAttendingForm(false);
		setNotAttendingForm(false);
		setName("");
		setAttending(false);
	};

	const handleOnNameFormNext = () => {
		setOnNameForm(false);
		setOnAttendingForm(true);
	};

	const handleOnAtteningFormYes = () => {
		setAttending(true);
		setOnAttendingForm(false);
	};

	const handleOnAtteningFormNo = () => {
		setAttending(false);
		setOnAttendingForm(false);
		setNotAttendingForm(true);
	};

	const handleNotAttendingSubmit = () => {
		handleModalClose();
	};

	const handleNameChange: InputChange = value => {
		if (value.length < 30) {
			setName(value);
		}
	};

	return (
		<Fragment>
			<Button
				onClick={handleModalOpen}
				icon={config.rsvp.open.icon}
				text={config.rsvp.open.label}
			/>
			<div
				className={bem("modal")}
				style={{ opacity: isModalOpen ? 1 : 0, visibility: isModalOpen ? "visible" : undefined }}
			>
				<div
					role="presentation"
					className={bem("modal-background")}
					onClick={handleModalClose}
					onKeyDown={handleModalClose}
				/>
				<div
					className={bem("modal-content", "Padding FlexColumnGap")}
					style={{ right: isModalOpen ? "50%" : 0 }}
				>
					<Button
						icon={config.rsvp.modal.closeButton.icon}
						title={config.rsvp.modal.closeButton.label}
						className={bem("modal-content-close")}
						onClick={handleModalClose}
					/>
					<div className={bem("modal-content-fields")}>
						<h2 className={bem("modal-content-title", "modal-content-text", "HeadingFive")}>
							{config.rsvp.modal.title}
						</h2>
						<div className="FlexColumnGap">
							{onNameForm && (
								<Fragment>
									<NameInput value={name} onChange={handleNameChange} />
									<Button
										rightIcon={config.rsvp.modal.forms.name.nextButton.icon}
										text={config.rsvp.modal.forms.name.nextButton.label}
										onClick={handleOnNameFormNext}
									/>
								</Fragment>
							)}
							{onAttendingForm && !onNameForm && (
								<Fragment>
									<div className={bem("modal-content-fields-attending")}>
										{config.rsvp.modal.forms.isAttending.paragraphs.map(paragraph => (
											<p
												key={paragraph}
												className={bem(
													"modal-content-fields-attending-paragraph",
													"modal-content-fields-text",
													"ParagraphOneBold",
												)}
											>
												{paragraph}
											</p>
										))}
									</div>
									<div className={bem("modal-content-buttons")}>
										<Button
											text={config.rsvp.modal.forms.isAttending.yesButton.label}
											rightIcon={config.rsvp.modal.forms.isAttending.yesButton.icon}
											onClick={handleOnAtteningFormYes}
										/>
										<Button
											transparent
											icon={config.rsvp.modal.forms.isAttending.noButton.icon}
											text={config.rsvp.modal.forms.isAttending.noButton.label}
											onClick={handleOnAtteningFormNo}
										/>
									</div>
								</Fragment>
							)}
							{notAttendingForm && !onNameForm && !onAttendingForm && (
								<Fragment>
									<div className={bem("modal-content-fields-attending")}>
										{config.rsvp.modal.forms.notAttending.paragraphs.map(paragraph => (
											<p
												key={paragraph}
												className={bem(
													"modal-content-fields-attending-paragraph",
													"modal-content-fields-text",
													"ParagraphOneBold",
												)}
											>
												{paragraph}
											</p>
										))}
									</div>
									<Button
										icon={config.rsvp.modal.forms.notAttending.submitButton.icon}
										text={config.rsvp.modal.forms.notAttending.submitButton.label}
										onClick={handleNotAttendingSubmit}
									/>
								</Fragment>
							)}
							{!onNameForm && !onAttendingForm && !notAttendingForm && (
								<Fragment>
									<NameInput value={name} onChange={handleNameChange} />
									{attending}
									<Button
										icon={config.rsvp.modal.forms.attending.submitButton.icon}
										text={config.rsvp.modal.forms.attending.submitButton.label}
										onClick={handleModalClose}
									/>
								</Fragment>
							)}
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default RSVP;
