import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"

import "./index.scss"

const bem = createBEM("Header")

const Header: FC = () => (
	<header className={bem("", "FlexRowCenter")}>
		<p className="ParagraphTwo">
			This is a header...
		</p>
	</header>
)

export default Header