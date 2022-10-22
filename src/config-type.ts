export interface Config {
	title: string;
	description: string;
	subTitle: string;
	location: Location;
	dates: Dates;
	blurb: Blurb;
	rsvp: RSVP;
	information: Information;
	countdown: Countdown;
	footer: Footer;
}

interface Location {
	lat: number;
	lng: number;
}

interface Dates {
	rsvp: Date;
	partyStart: Date;
	partyEnd: Date;
}

interface Blurb {
	title: string;
	catchLine: string;
	paragraphs: string[];
	emojis: string;
}

interface RSVP {
	open: Button;
	modal: RSVPModal;
}

interface RSVPModal {
	title: string;
	closeButton: Button;
	forms: RSVPForms;
}

interface RSVPForms {
	name: RSVPFormName;
	isAttending: RSVPFormIsAttending;
	notAttending: RSVPFormNotAttending;
	attending: RSVPFormAttending;
	submitted: RSVPFormSubmitted;
}

interface RSVPFormName {
	name: Input;
	nextButton: Button;
}

interface RSVPFormIsAttending extends Paragraphs {
	yesButton: Button;
	noButton: Button;
}

interface RSVPFormNotAttending {
	paragraphs: string[];
	inputs: {
		notes: Input;
	};
	submitButton: Button;
	closeButton: Button;
}

interface RSVPFormAttending extends Paragraphs {
	inputs: {
		name: Input;
		emailAddress: Input;
		dogs: Dropdown;
		kids: Dropdown;
		notes: Input;
	};
	checkboxes: string[];
	submitButton: Button;
}

interface RSVPFormSubmitted extends Paragraphs {
	thankYou: string;
}

interface Information {
	expandText: {
		full: string;
		small: string;
	};
	sections: InformationSection[];
}

interface InformationSection extends Partial<Paragraphs> {
	name: string;
	label: string;
	timeline?: Array<InformationTimeline>;
}

interface InformationTimeline {
	time: string;
	text: string;
}

interface Countdown {
	text: string;
}

interface Footer {
	createdBy: {
		text: string;
		website: Website;
	};
	sourceCode: Website;
}

interface Button {
	icon: string;
	label: string;
}

interface Input {
	label: string;
	placeholder: string;
}

interface Dropdown {
	label: string;
	options: string[];
}

interface Website {
	text: string;
	url: string;
}

interface Paragraphs {
	paragraphs: string[];
}
