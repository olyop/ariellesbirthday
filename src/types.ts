export interface ConfigContext {
	DATES: {
		RSVP: string;
		PARTY: string;
	};

	TITLE: string;

	RSVP: {
		BUTTON: {
			ICON: string;
			TEXT: string;
		};
	};

	INFORMATION: {
		EXPAND_TEXT: {
			FULL: string;
			SMALL: string;
		};
		WHERE: string;
		WHEN: string;
		TIME: string;
	};

	FOOTER: {
		CREATED_BY: {
			TEXT: string;
			LINK: {
				TEXT: string;
				URL: string;
			};
		};
	};
}
