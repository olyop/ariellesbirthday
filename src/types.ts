export interface ConfigContext {
	dates: Dates;
	title: string;
	pageTitle: string;
	subTitle: string;
	rsvp: Rsvp;
	information: Information;
	footer: Footer;
}

interface Dates {
	rsvp: Date;
	party: Date;
}

interface Footer {
	createdBy: CreatedBy;
}

interface CreatedBy {
	text: string;
	link: Link;
}

interface Link {
	url: string;
	text: string;
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
	paragraphs: string[];
}

interface Rsvp {
	button: Button;
}

interface Button {
	icon: string;
	text: string;
}
