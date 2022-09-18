import { createElement, FC } from "react"
import { Metadata } from "@oly_op/react-metadata"

import "./index.scss"

const HomePage: FC = () => (
	<Metadata>
		<div className="FlexColumnCenterGap PaddingTop Center">
			<h1 className="HeadingTwo">
				Arielle&apos;s 30th<br/>
				Birthday Party
			</h1>
			<p className="ParagraphTwo">
				Content goes here...
			</p>
			<p className="ParagraphTwo">
				Whatever we want! Anything!
			</p>
		</div>
	</Metadata>
)

export default HomePage