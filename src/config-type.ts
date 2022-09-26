export interface Config {
	title: string;
	description: string;
	subTitle: string;
	dates: Dates;
	blurb: Blurb;
	rsvp: Rsvp;
	information: Information;
	countdown: Countdown;
	footer: Footer;
}

export interface Blurb {
	title: string;
	paragraphs: string[];
}

export interface Countdown {
	text: string;
}

export interface Dates {
	rsvp: Date;
	party: Date;
}

export interface Footer {
	createdBy: CreatedBy;
	sourceCode: SourceCode;
}

export interface CreatedBy {
	text: string;
	website: SourceCode;
}

export interface SourceCode {
	text: string;
	url: string;
}

export interface Information {
	expandText: ExpandText;
	sections: Section[];
}

export interface ExpandText {
	full: string;
	small: string;
}

export interface Section {
	name: string;
	label: string;
	paragraphs: string[];
}

export interface Rsvp {
	open: Open;
	modal: Modal;
}

export interface Modal {
	title: string;
	closeButton: Open;
	forms: Forms;
}

export interface Open {
	icon: string;
	label: string;
}

export interface Forms {
	name: Name;
	isAttending: IsAttending;
	notAttending: NotAttending;
	attending: Attending;
}

export interface IsAttending {
	paragraphs: string[];
	yesButton: Open;
	noButton: Open;
}

export interface NotAttending {
	paragraphs: string[];
	submitButton: Open;
}

export interface Name {
	nextButton: NextButton;
}

export interface NextButton {
	icon: string;
	label: string;
}

export interface Attending {
	submitButton: Open;
}
