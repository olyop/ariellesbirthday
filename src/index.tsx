import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { createElement, StrictMode } from "react"

import Pages from "./pages"
import Metadata from "./providers/metadata"

import "@oly_op/css-utilities/index.css"

import "./index.scss"
import Header from "./components/header"

const container =
	document.getElementById("Root")

if (container) {
	createRoot(container).render(
		<StrictMode>
			<Metadata>
				<BrowserRouter>
					<Header/>
					<Pages/>
				</BrowserRouter>
			</Metadata>
		</StrictMode>,
	)
}