import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { createElement, FC, Fragment, useEffect, useState } from "react";

import { useKeyPress } from "./key-press";
import Input, { InputChange } from "../input";
import { useConfig } from "../../config-content";

import "./index.scss";
import Select from "../select";

const bem = createBEM("RSVP");

const RSVP: FC = () => {
	const config = useConfig();
	const escapePress = useKeyPress("Escape");
	const [isModalOpen, setIsModalOpen] = useState(process.env.NODE_ENV === "development");

	const [onNameForm, setOnNameForm] = useState(true);
	const [onAttendingForm, setOnAttendingForm] = useState(false);
	const [notAttendingForm, setNotAttendingForm] = useState(false);

	const [name, setName] = useState("");
	const [notes, setNotes] = useState("");
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

	useEffect(() => {
		if (escapePress) {
			handleModalClose();
		}
	}, [escapePress]);

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

	const handleNotesChange: InputChange = value => {
		if (value.length < 30) {
			setNotes(value);
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
					aria-modal={isModalOpen}
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
									{config.rsvp.modal.forms.name.paragraphs && (
										<div className={bem("modal-content-fields-attending")}>
											{config.rsvp.modal.forms.name.paragraphs.map(paragraph => (
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
									)}
									<Input
										name={config.rsvp.modal.forms.name.inputs.name.label}
										inputID={config.rsvp.modal.forms.name.inputs.name.label}
										tabIndex={1}
										value={name}
										onChange={handleNameChange}
										placeholder={config.rsvp.modal.forms.name.inputs.name.placeholder}
									/>
									<Button
										tabIndex={2}
										disabled={name === ""}
										rightIcon={config.rsvp.modal.forms.name.nextButton.icon}
										text={config.rsvp.modal.forms.name.nextButton.label}
										onClick={handleOnNameFormNext}
									/>
								</Fragment>
							)}
							{onAttendingForm && !onNameForm && (
								<Fragment>
									{config.rsvp.modal.forms.isAttending.paragraphs && (
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
									)}
									<div className={bem("modal-content-buttons")}>
										<Button
											tabIndex={1}
											text={config.rsvp.modal.forms.isAttending.yesButton.label}
											rightIcon={config.rsvp.modal.forms.isAttending.yesButton.icon}
											onClick={handleOnAtteningFormYes}
										/>
										<Button
											transparent
											tabIndex={2}
											icon={config.rsvp.modal.forms.isAttending.noButton.icon}
											text={config.rsvp.modal.forms.isAttending.noButton.label}
											onClick={handleOnAtteningFormNo}
										/>
									</div>
								</Fragment>
							)}
							{notAttendingForm && !onNameForm && !onAttendingForm && (
								<Fragment>
									{config.rsvp.modal.forms.notAttending.paragraphs && (
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
									)}
									<div className="FlexColumnGapQuart">
										<Button
											tabIndex={1}
											icon={config.rsvp.modal.forms.notAttending.submitButton.icon}
											text={config.rsvp.modal.forms.notAttending.submitButton.label}
											onClick={handleNotAttendingSubmit}
										/>
										<Button
											transparent
											tabIndex={2}
											icon={config.rsvp.modal.forms.notAttending.closeButton.icon}
											text={config.rsvp.modal.forms.notAttending.closeButton.label}
											onClick={handleNotAttendingSubmit}
										/>
									</div>
								</Fragment>
							)}
							{!onNameForm && !onAttendingForm && !notAttendingForm && (
								<Fragment>
									<div className={bem("modal-content-fields-attending")}>
										{config.rsvp.modal.forms.attending.paragraphs?.map(paragraph => (
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
									<Input
										name={config.rsvp.modal.forms.name.inputs.name.label}
										inputID={config.rsvp.modal.forms.name.inputs.name.label}
										tabIndex={1}
										value={name}
										onChange={handleNameChange}
										placeholder={config.rsvp.modal.forms.name.inputs.name.placeholder}
									/>
									{attending}
									<div className={bem("modal-content-fields-dogsandkids")}>
										<Select
											inputID="dogs"
											name="# Dogs"
											onChange={() => {}}
											tabIndex={2}
											value={["None"]}
										/>
										<Select
											inputID="kids"
											name="# Kids"
											onChange={() => {}}
											tabIndex={3}
											value={["None"]}
										/>
									</div>
									<Input
										isTextArea
										name="Notes"
										inputID="notes"
										tabIndex={4}
										value={notes}
										onChange={handleNotesChange}
										placeholder="Notes"
										inputClassName={bem("modal-content-fields-notes")}
									/>
									<Button
										tabIndex={2}
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
