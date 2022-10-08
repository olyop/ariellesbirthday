import ms from "ms";
import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { createElement, FC, Fragment, useCallback, useEffect, useRef, useState } from "react";

import Spinner from "./spinner";
import Fireworks from "./fireworks";
import { useKeyPress } from "./key-press";
import { algoliaRSVPIndex } from "./algolia";
import { useConfig } from "../../../config-content";
import Input, { InputChange, InputType } from "../../input";

import "./index.scss";

const bem = createBEM("RSVPForm");

const IS_MOBILE = /Mobi|Android/i.test(navigator.userAgent);

const enum Forms {
	NAME,
	IS_ATTENDING,
	NOT_ATTENDING,
	ATTENDING,
	SUBMIT,
	ERROR,
}

const RSVPForm: FC = () => {
	const config = useConfig();
	const escapePress = useKeyPress("Escape");

	const DEFAULT_OPTION_DOGS = config.rsvp.modal.forms.attending.inputs.dogs.options[0] || "";
	const DEFAULT_OPTION_KIDS = config.rsvp.modal.forms.attending.inputs.kids.options[0] || "";

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [hasSubmitted, setHasSubmitted] = useState(false);

	const [form, setForm] = useState(Forms.NAME);

	const [name, setName] = useState("");
	const [notes, setNotes] = useState("");
	const [attending, setAttending] = useState(false);
	const [dogs, setDogs] = useState(DEFAULT_OPTION_DOGS);
	const [kids, setKids] = useState(DEFAULT_OPTION_KIDS);

	const sessionTime = useRef(0);
	const [loading, setLoading] = useState(false);
	const { executeRecaptcha } = useGoogleReCaptcha();
	const [reCaptchaToken, setReCaptchaToken] = useState<string | null>(null);

	const handleReCaptchaVerify = useCallback(async () => {
		if (executeRecaptcha) {
			const token = await executeRecaptcha("rsvp");
			setReCaptchaToken(token);
		}
	}, [executeRecaptcha]);

	const handleModalOpen = () => {
		setIsModalOpen(true);
	};

	const handleResetModal = () => {
		setForm(Forms.NAME);
		setName("");
		setNotes("");
		setAttending(false);
		setDogs(DEFAULT_OPTION_DOGS);
		setKids(DEFAULT_OPTION_KIDS);
		setLoading(false);
		setReCaptchaToken(null);
	};

	const handleModalClose = () => {
		handleResetModal();
		setIsModalOpen(false);
	};

	const handleOnNameFormNext = () => {
		setForm(Forms.IS_ATTENDING);
	};

	const handleOnIsAttendingFormYes = () => {
		setAttending(true);
		setForm(Forms.ATTENDING);
	};

	const handleOnIsAttendingFormNo = () => {
		setAttending(false);
		setForm(Forms.NOT_ATTENDING);
	};

	const handleNameChange: InputChange = value => {
		setName(value);
	};

	const handleDogsChange: InputChange = value => {
		setDogs(value);
	};

	const handleKidsChange: InputChange = value => {
		setKids(value);
	};

	const handleNotesChange: InputChange = value => {
		setNotes(value);
	};

	const submitForm = async () => {
		try {
			const baseForm = {
				name,
				isMobile: IS_MOBILE,
				objectID: Date.now(),
				userAgent: navigator.userAgent,
				attending: attending ? "Yes" : "No",
				sessionTime: `${sessionTime.current} seconds`,
				dateSubmitted: new Date(Date.now()).toISOString(),
			};

			const data = attending ? { ...baseForm, dogs, kids, notes } : baseForm;

			await algoliaRSVPIndex.saveObject(data);

			await new Promise(resolve => {
				setTimeout(resolve, ms("800ms"));
			});

			if (attending) {
				setForm(Forms.SUBMIT);
			}
		} catch (e) {
			setForm(Forms.ERROR);
		} finally {
			setLoading(false);
			if (!attending) {
				handleModalClose();
			}
			setHasSubmitted(true);
		}
	};

	const handleSubmit = () => {
		if (name !== "" && name.length < 60 && reCaptchaToken) {
			setLoading(true);
		}
	};

	useEffect(() => {
		if (loading) {
			void submitForm();
		}
	}, [loading]);

	useEffect(() => {
		if (escapePress) {
			handleModalClose();
		}
	}, [escapePress]);

	useEffect(() => {
		void handleReCaptchaVerify();
	}, [handleReCaptchaVerify]);

	useEffect(() => {
		const interval = setInterval(() => {
			sessionTime.current += 1;
		}, ms("1s"));
		return () => clearInterval(interval);
	}, []);

	return (
		<Fragment>
			<Button
				onClick={handleModalOpen}
				icon={config.rsvp.open.icon}
				text={config.rsvp.open.label}
				textClassName={bem("button-text")}
				className={bem("button", "Elevated")}
			/>
			<div className={bem(isModalOpen && "modal-open", "modal")}>
				<div
					role="presentation"
					className={bem("modal-background")}
					onClick={handleModalClose}
					onKeyDown={handleModalClose}
				/>
				<div
					aria-modal={isModalOpen}
					className={bem(
						isModalOpen && "modal-content-open",
						"modal-content",
						"Padding FlexColumnGap",
					)}
				>
					{form === Forms.NOT_ATTENDING || (
						<Button
							onClick={handleModalClose}
							icon={config.rsvp.modal.closeButton.icon}
							title={config.rsvp.modal.closeButton.label}
							className={bem(loading && "modal-content-close-disabled", "modal-content-close")}
						/>
					)}
					<div className={bem("modal-content-fields")}>
						<h2 className={bem("modal-content-title", "modal-content-text", "HeadingFour")}>
							{config.rsvp.modal.title}
						</h2>
						<div className={bem("modal-content-body", "FlexColumnGap")}>
							{hasSubmitted && form !== Forms.SUBMIT ? (
								<p className="ParagraphOne">You have already submitted.</p>
							) : (
								<Fragment>
									{loading ? (
										<Fragment>
											<Spinner />
											<p className={bem("modal-content-submitting", "ParagraphOne")}>Submitting</p>
										</Fragment>
									) : (
										<Fragment>
											{form === Forms.NAME && (
												<Fragment>
													<Input
														type={InputType.TEXT}
														name={config.rsvp.modal.forms.name.name.label}
														inputID={config.rsvp.modal.forms.name.name.label}
														tabIndex={1}
														value={name}
														maxLength={60}
														onChange={handleNameChange}
														placeholder={config.rsvp.modal.forms.name.name.placeholder}
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
											{form === Forms.IS_ATTENDING && (
												<Fragment>
													{config.rsvp.modal.forms.isAttending.paragraphs && (
														<div className={bem("modal-content-fields-paragraphs")}>
															{config.rsvp.modal.forms.isAttending.paragraphs.map(paragraph => (
																<p
																	key={paragraph}
																	className={bem(
																		"modal-content-fields-paragraph",
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
															onClick={handleOnIsAttendingFormYes}
															text={config.rsvp.modal.forms.isAttending.yesButton.label}
															rightIcon={config.rsvp.modal.forms.isAttending.yesButton.icon}
														/>
														<Button
															transparent
															tabIndex={2}
															onClick={handleOnIsAttendingFormNo}
															text={config.rsvp.modal.forms.isAttending.noButton.label}
															rightIcon={config.rsvp.modal.forms.isAttending.noButton.icon}
														/>
													</div>
												</Fragment>
											)}
											{form === Forms.NOT_ATTENDING && (
												<Fragment>
													{config.rsvp.modal.forms.notAttending.paragraphs && (
														<div className={bem("modal-content-fields-paragraphs")}>
															{config.rsvp.modal.forms.notAttending.paragraphs.map(paragraph => (
																<p
																	key={paragraph}
																	className={bem(
																		"modal-content-fields-paragraph",
																		"modal-content-fields-text",
																		"ParagraphOneBold",
																	)}
																>
																	{paragraph}
																</p>
															))}
														</div>
													)}
													{reCaptchaToken && (
														<Button
															tabIndex={1}
															onClick={handleSubmit}
															icon={config.rsvp.modal.forms.notAttending.submitButton.icon}
															text={config.rsvp.modal.forms.notAttending.submitButton.label}
														/>
													)}
												</Fragment>
											)}
											{form === Forms.ATTENDING && (
												<Fragment>
													<div className={bem("modal-content-fields-paragraphs")}>
														{config.rsvp.modal.forms.attending.paragraphs?.map(paragraph => (
															<p
																key={paragraph}
																className={bem(
																	"modal-content-fields-paragraph",
																	"modal-content-fields-text",
																	"ParagraphOneBold",
																)}
															>
																{paragraph}
															</p>
														))}
													</div>
													<Input
														type={InputType.TEXT}
														tabIndex={1}
														value={name}
														maxLength={60}
														onChange={handleNameChange}
														name={config.rsvp.modal.forms.attending.inputs.name.label}
														inputID={config.rsvp.modal.forms.attending.inputs.name.label}
														placeholder={config.rsvp.modal.forms.attending.inputs.name.placeholder}
													/>
													<div className={bem("modal-content-fields-dogsandkids")}>
														<Input
															type={InputType.SELECT}
															inputID="dogs"
															tabIndex={2}
															value={dogs}
															onChange={handleDogsChange}
															name={config.rsvp.modal.forms.attending.inputs.dogs.label}
															selectOptions={config.rsvp.modal.forms.attending.inputs.dogs.options}
														/>
														<Input
															type={InputType.SELECT}
															inputID="kids"
															tabIndex={3}
															value={kids}
															onChange={handleKidsChange}
															name={config.rsvp.modal.forms.attending.inputs.kids.label}
															selectOptions={config.rsvp.modal.forms.attending.inputs.kids.options}
														/>
													</div>
													<Input
														type={InputType.TEXTAREA}
														name="Notes"
														inputID="notes"
														tabIndex={4}
														value={notes}
														maxLength={300}
														placeholder="Notes"
														onChange={handleNotesChange}
														inputClassName={bem("modal-content-fields-notes")}
													/>
													<div className={bem("modal-content-fields-paragraphs")}>
														{config.rsvp.modal.forms.attending.statement.paragraphs.map(
															paragraph => (
																<p
																	key={paragraph}
																	className={bem(
																		"modal-content-fields-paragraph",
																		"modal-content-fields-text",
																		"ParagraphTwoBold",
																	)}
																>
																	{paragraph}
																</p>
															),
														)}
													</div>
													{reCaptchaToken && (
														<Button
															tabIndex={5}
															disabled={name === ""}
															onClick={handleSubmit}
															icon={config.rsvp.modal.forms.attending.submitButton.icon}
															text={config.rsvp.modal.forms.attending.submitButton.label}
														/>
													)}
												</Fragment>
											)}
											{form === Forms.SUBMIT && (
												<Fragment>
													<h3 className="HeadingFour">Thank you!</h3>
													<Fireworks />
												</Fragment>
											)}
											{form === Forms.ERROR && (
												<p className="ParagraphOne">
													Error... please check you&apos;re internet connection
												</p>
											)}
										</Fragment>
									)}
								</Fragment>
							)}
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default RSVPForm;
