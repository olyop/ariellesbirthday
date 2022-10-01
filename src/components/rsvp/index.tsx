import ms from "ms";
import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { createElement, FC, Fragment, useCallback, useEffect, useRef, useState } from "react";

import Select from "../select";
import Spinner from "./spinner";
import Fireworks from "./fireworks";
import { useKeyPress } from "./key-press";
import { algoliaRSVPIndex } from "./algolia";
import Input, { InputChange } from "../input";
import { useConfig } from "../../config-content";

import "./index.scss";

const bem = createBEM("RSVP");
const IS_MOBILE =
	screen.orientation.type === "portrait-primary" ||
	screen.orientation.type === "portrait-secondary";

const RSVP: FC = () => {
	const config = useConfig();
	const escapePress = useKeyPress("Escape");

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const DEFAULT_OPTION_DOGS = config.rsvp.modal.forms.attending.inputs.dogs.options[0]!;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const DEFAULT_OPTION_KIDS = config.rsvp.modal.forms.attending.inputs.kids.options[0]!;

	const [isModalOpen, setIsModalOpen] = useState(false);

	const [onNameForm, setOnNameForm] = useState(true);
	const [onIsAttendingForm, setOnIsAttendingForm] = useState(false);
	const [onNotAttendingForm, setOnNotAttendingForm] = useState(false);
	const [onAttendingForm, setOnAttendingForm] = useState(false);
	const [onSubmittedForm, setOnSubmittedForm] = useState(false);

	const [name, setName] = useState("");
	const [notes, setNotes] = useState("");
	const [attending, setAttending] = useState(false);
	const [dogs, setDogs] = useState(DEFAULT_OPTION_DOGS);
	const [kids, setKids] = useState(DEFAULT_OPTION_KIDS);

	const sessionTime = useRef(0);
	const [loading, setLoading] = useState(false);
	const { executeRecaptcha } = useGoogleReCaptcha();
	const reCaptchaToken = useRef<string | null>(null);

	const handleReCaptchaVerify = useCallback(async () => {
		if (executeRecaptcha) {
			const token = await executeRecaptcha("rsvp");
			reCaptchaToken.current = token;
		}
	}, [executeRecaptcha]);

	const handleModalOpen = () => {
		setIsModalOpen(true);
	};

	const handleResetModal = () => {
		setOnNameForm(true);
		setOnIsAttendingForm(false);
		setOnNotAttendingForm(false);
		setOnAttendingForm(false);
		setOnSubmittedForm(false);
		setName("");
		setNotes("");
		setAttending(false);
		setDogs(DEFAULT_OPTION_DOGS);
		setKids(DEFAULT_OPTION_KIDS);
		setLoading(false);
		reCaptchaToken.current = null;
	};

	const handleModalClose = () => {
		if (!onNotAttendingForm && !loading) {
			handleResetModal();
			setIsModalOpen(false);
		}
	};

	const handleOnNameFormNext = () => {
		setOnNameForm(false);
		setOnIsAttendingForm(true);
	};

	const handleOnIsAttendingFormYes = () => {
		setOnIsAttendingForm(false);
		setAttending(true);
		setOnAttendingForm(true);
	};

	const handleOnIsAttendingFormNo = () => {
		setOnIsAttendingForm(false);
		setAttending(false);
		setOnNotAttendingForm(true);
	};

	const handleSubmit = () => {
		if (name !== "" && name.length < 60) {
			setLoading(true);
		}
	};

	const handleNameChange: InputChange = value => {
		setName(value);
	};

	const handleDogsChange: InputChange = value => {
		console.log(value);
		setDogs(value);
	};

	const handleKidsChange: InputChange = value => {
		setKids(value);
	};

	const handleNotesChange: InputChange = value => {
		if (value.length < 300) {
			setNotes(value);
		}
	};

	const submitForm = async () => {
		try {
			const baseForm = {
				name,
				reCaptchaToken,
				isMobile: IS_MOBILE,
				objectID: Date.now(),
				userAgent: navigator.userAgent,
				attending: attending ? "Yes" : "No",
				sessionTime: `${sessionTime.current} seconds`,
				dateSubmitted: new Date(Date.now()).toISOString(),
			};

			const attendingForm = {
				dogs,
				kids,
				notes,
			};

			const form = attending ? { ...baseForm, ...attendingForm } : baseForm;

			await algoliaRSVPIndex.saveObject(form);

			await new Promise(resolve => {
				setTimeout(resolve, ms("800ms"));
			});
		} catch (error) {
			console.error({ error });
		} finally {
			if (onAttendingForm) {
				setOnAttendingForm(false);
				setOnSubmittedForm(true);
				setLoading(false);
			} else {
				setOnNotAttendingForm(false);
				handleResetModal();
				setIsModalOpen(false);
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		if (loading && reCaptchaToken) {
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
					{onNotAttendingForm || (
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
							{loading ? (
								<Fragment>
									<Spinner />
									<p className={bem("modal-content-submitting", "ParagraphOne")}>Submitting</p>
								</Fragment>
							) : (
								<Fragment>
									{onNameForm && (
										<Fragment>
											<Input
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
									{onIsAttendingForm && (
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
													tabIndex={1}
													onClick={handleOnIsAttendingFormNo}
													text={config.rsvp.modal.forms.isAttending.noButton.label}
													rightIcon={config.rsvp.modal.forms.isAttending.noButton.icon}
												/>
											</div>
										</Fragment>
									)}
									{onNotAttendingForm && (
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
											<Button
												tabIndex={1}
												onClick={handleSubmit}
												icon={config.rsvp.modal.forms.notAttending.submitButton.icon}
												text={config.rsvp.modal.forms.notAttending.submitButton.label}
											/>
										</Fragment>
									)}
									{onAttendingForm && (
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
												tabIndex={1}
												value={name}
												maxLength={60}
												onChange={handleNameChange}
												name={config.rsvp.modal.forms.attending.inputs.name.label}
												inputID={config.rsvp.modal.forms.attending.inputs.name.label}
												placeholder={config.rsvp.modal.forms.attending.inputs.name.placeholder}
											/>
											<div className={bem("modal-content-fields-dogsandkids")}>
												<Select
													inputID="dogs"
													tabIndex={2}
													value={dogs}
													onChange={handleDogsChange}
													name={config.rsvp.modal.forms.attending.inputs.dogs.label}
													options={config.rsvp.modal.forms.attending.inputs.dogs.options}
												/>
												<Select
													inputID="kids"
													tabIndex={3}
													value={kids}
													onChange={handleKidsChange}
													name={config.rsvp.modal.forms.attending.inputs.kids.label}
													options={config.rsvp.modal.forms.attending.inputs.kids.options}
												/>
											</div>
											<Input
												isTextArea
												name="Notes"
												inputID="notes"
												tabIndex={4}
												value={notes}
												placeholder="Notes"
												onChange={handleNotesChange}
												inputClassName={bem("modal-content-fields-notes")}
											/>
											<div className={bem("modal-content-fields-paragraphs")}>
												{config.rsvp.modal.forms.attending.statement.paragraphs.map(paragraph => (
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
											<Button
												tabIndex={2}
												disabled={name === ""}
												icon={config.rsvp.modal.forms.attending.submitButton.icon}
												text={config.rsvp.modal.forms.attending.submitButton.label}
												onClick={handleSubmit}
											/>
										</Fragment>
									)}
									{onSubmittedForm && (
										<Fragment>
											<h3 className="HeadingFour">Thank you!</h3>
											<Fireworks />
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

export default RSVP;
