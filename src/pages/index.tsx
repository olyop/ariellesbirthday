import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"
import { Routes, Route } from "react-router-dom"

import HomePage from "./home"

import "./index.scss"

const bem = createBEM("Pages")

const Pages: FC = () => (
	<div className={bem("")}>
		<Routes>
			<Route
				path=""
				element={<HomePage/>}
			/>
		</Routes>
	</div>
)

export default Pages