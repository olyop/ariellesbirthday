import ms from "ms";
import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
	createElement,
	FC,
	Fragment,
	useCallback,
	useEffect,
	useRef,
	useState,
	ChangeEventHandler,
} from "react";

import Spinner from "./spinner";
import Fireworks from "./fireworks";
import { useKeyPress } from "./key-press";
import { algoliaRSVPIndex } from "./algolia";
import AddToCalender from "./add-to-calender";
import { useConfig } from "../../../config-content";
import Input, { InputChange, InputType } from "../../input";

import "./index.scss";

const bem = createBEM("RSVPForm");

const IS_MOBILE = /mobi|android/i.test(navigator.userAgent);

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
	const [emailAddress, setEmailAddress] = useState("");
	const [dogs, setDogs] = useState(DEFAULT_OPTION_DOGS);
	const [kids, setKids] = useState(DEFAULT_OPTION_KIDS);
	const [notes, setNotes] = useState("");
	const [attending, setAttending] = useState(false);
	const [agreements, setAgreements] = useState([false, false]);

	const sessionTime = useRef(0);
	const [loading, setLoading] = useState(false);

	const { executeRecaptcha } = useGoogleReCaptcha();
	const [reCaptchaToken, setReCaptchaToken] = useState<string | null>(null);

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

	const handleIsNotAttendingBack = () => {
		setAttending(false);
		setForm(Forms.IS_ATTENDING);
	};

	const handleNameChange: InputChange = value => {
		setName(value);
	};

	const handleEmailAddressChange: InputChange = value => {
		setEmailAddress(value);
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

	const handleAgreementCheck =
		(index: number): ChangeEventHandler<HTMLInputElement> =>
		event => {
			setAgreements(prevState => {
				const newState = [...prevState];
				newState[index] = event.target.checked;
				return newState;
			});
		};

	const submitForm = async () => {
		try {
			const EPOCH_NOW = Date.now();

			const baseForm = {
				name: name.trim(),
				notes: notes.trim(),
				isMobile: IS_MOBILE,
				objectID: EPOCH_NOW,
				userAgent: navigator.userAgent,
				attending: attending ? "Yes" : "No",
				sessionTime: `${sessionTime.current} seconds`,
				dateSubmitted: new Date(EPOCH_NOW).toISOString(),
			};

			const data = attending
				? { ...baseForm, dogs, kids, emailAddress: emailAddress.trim() }
				: baseForm;

			await algoliaRSVPIndex.saveObject(data);

			await new Promise(resolve => {
				setTimeout(resolve, ms("800ms"));
			});

			if (attending) {
				setForm(Forms.SUBMIT);
			}
		} catch {
			setForm(Forms.ERROR);
		} finally {
			setLoading(false);
			if (!attending) {
				handleModalClose();
			}
			setHasSubmitted(true);
		}
	};

	const canSubmitBase = name.trim() !== "" && name.trim().length < 60 && reCaptchaToken;

	const canSubmitAttending =
		canSubmitBase &&
		emailAddress !== "" &&
		emailAddress.length < 60 &&
		agreements[0] &&
		agreements[1];

	const handleSubmit = () => {
		if (
			(form === Forms.ATTENDING && canSubmitAttending) ||
			(form === Forms.NOT_ATTENDING && canSubmitBase)
		) {
			setLoading(true);
		}
	};

	const handleReCaptchaVerify = useCallback(async () => {
		if (executeRecaptcha) {
			const token = await executeRecaptcha("rsvp");
			setReCaptchaToken(token);
		}
	}, [executeRecaptcha]);

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
		void handleReCaptchaVerify();
	}, [attending]);

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
					onClick={form === Forms.NOT_ATTENDING ? undefined : handleModalClose}
					onKeyDown={form === Forms.NOT_ATTENDING ? undefined : handleModalClose}
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
														autoComplete="name"
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
													<Input
														type={InputType.TEXTAREA}
														inputID="notes"
														tabIndex={4}
														value={notes}
														maxLength={300}
														onChange={handleNotesChange}
														inputClassName={bem("modal-content-fields-notes")}
														name={config.rsvp.modal.forms.notAttending.inputs.notes.label}
														placeholder={
															config.rsvp.modal.forms.notAttending.inputs.notes.placeholder
														}
													/>
													<div className="FlexColumnGapQuart">
														{reCaptchaToken && (
															<Button
																tabIndex={1}
																onClick={handleSubmit}
																disabled={!canSubmitBase}
																icon={config.rsvp.modal.forms.notAttending.submitButton.icon}
																text={config.rsvp.modal.forms.notAttending.submitButton.label}
															/>
														)}
														<Button
															transparent
															tabIndex={2}
															text="Go Back"
															icon="arrow_back"
															onClick={handleIsNotAttendingBack}
														/>
													</div>
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
														autoComplete="name"
														onChange={handleNameChange}
														name={config.rsvp.modal.forms.attending.inputs.name.label}
														inputID={config.rsvp.modal.forms.attending.inputs.name.label}
														placeholder={config.rsvp.modal.forms.attending.inputs.name.placeholder}
													/>
													<Input
														type={InputType.TEXT}
														tabIndex={2}
														maxLength={60}
														value={emailAddress}
														autoComplete="email"
														onChange={handleEmailAddressChange}
														name={config.rsvp.modal.forms.attending.inputs.emailAddress.label}
														inputID={config.rsvp.modal.forms.attending.inputs.emailAddress.label}
														placeholder={
															config.rsvp.modal.forms.attending.inputs.emailAddress.placeholder
														}
													/>
													<div className={bem("modal-content-fields-dogsandkids")}>
														<Input
															type={InputType.SELECT}
															inputID="dogs"
															tabIndex={3}
															value={dogs}
															onChange={handleDogsChange}
															name={config.rsvp.modal.forms.attending.inputs.dogs.label}
															selectOptions={config.rsvp.modal.forms.attending.inputs.dogs.options}
														/>
														<Input
															type={InputType.SELECT}
															inputID="kids"
															tabIndex={4}
															value={kids}
															onChange={handleKidsChange}
															name={config.rsvp.modal.forms.attending.inputs.kids.label}
															selectOptions={config.rsvp.modal.forms.attending.inputs.kids.options}
														/>
													</div>
													<Input
														type={InputType.TEXTAREA}
														inputID="notes"
														tabIndex={5}
														value={notes}
														maxLength={300}
														autoComplete="off"
														onChange={handleNotesChange}
														inputClassName={bem("modal-content-fields-notes")}
														name={config.rsvp.modal.forms.attending.inputs.notes.label}
														placeholder={config.rsvp.modal.forms.attending.inputs.notes.placeholder}
													/>
													<p className={bem("modal-content-plusone", "ParagraphTwoBold")}>
														Bringing a plus one?
														<br />
														Tell them to fill out this form.
													</p>
													<div className="FlexColumn">
														{config.rsvp.modal.forms.attending.checkboxes.map((checkbox, index) => (
															<div key={checkbox} className={bem("modal-content-checkbox")}>
																<input
																	id={checkbox}
																	type="checkbox"
																	name={checkbox}
																	tabIndex={6 + index}
																	checked={agreements[index]}
																	onChange={handleAgreementCheck(index)}
																	className={bem("modal-content-checkbox-box", "ParagraphTwoBold")}
																/>
																<label
																	htmlFor={checkbox}
																	className={bem(
																		"modal-content-checkbox-label",
																		"ParagraphTwoBold",
																	)}
																>
																	{checkbox}
																</label>
															</div>
														))}
													</div>
													{reCaptchaToken && (
														<Button
															tabIndex={8}
															onClick={handleSubmit}
															disabled={!canSubmitAttending}
															icon={config.rsvp.modal.forms.attending.submitButton.icon}
															text={config.rsvp.modal.forms.attending.submitButton.label}
														/>
													)}
												</Fragment>
											)}
											{form === Forms.SUBMIT && (
												<Fragment>
													<h3 className="HeadingFour">Thank you!</h3>
													<AddToCalender />
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
