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

interface Blurb {
	title: string;
	paragraphs: string[];
}

interface Countdown {
	text: string;
}

interface Dates {
	rsvp: Date;
	party: Date;
}

interface Footer {
	createdBy: CreatedBy;
	sourceCode: SourceCode;
}

interface CreatedBy {
	text: string;
	website: SourceCode;
}

interface SourceCode {
	text: string;
	url: string;
}

interface Information {
	expandText: ExpandText;
	sections: Section[];
}

interface ExpandText {
	full: string;
	small: string;
}

interface Section {
	name: string;
	label: string;
	paragraphs?: string[];
}

interface Rsvp {
	open: Open;
	modal: Modal;
}

interface Modal {
	title: string;
	closeButton: Open;
	forms: Forms;
}

interface Open {
	icon: string;
	label: string;
}

interface Forms {
	name: FormsName;
	isAttending: IsAttending;
	notAttending: NotAttending;
	attending: Attending;
}

interface Attending {
	paragraphs?: string[];
	inputs: Inputs;
	submitButton: Open;
}

interface Inputs {
	name: InputsName;
}

interface InputsName {
	label: string;
	placeholder: string;
}

interface IsAttending {
	paragraphs?: string[];
	yesButton: Open;
	noButton: Open;
}

interface FormsName {
	paragraphs?: string[];
	inputs: Inputs;
	nextButton: Open;
}

interface NotAttending {
	paragraphs?: string[];
	submitButton: Open;
	closeButton: Open;
}
