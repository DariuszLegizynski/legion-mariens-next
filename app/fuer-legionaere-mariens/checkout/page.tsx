"use client"

import { useFormState, useFormStatus } from "react-dom"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

import BaseButton from "@/components/base/BaseButton"
import { getStrapiCartData, getStrapiData } from "@/app/_utils/services/getStrapiData"

import type { Cart as CartType } from "@/types/Cart"

const initialState = {
	strapiErrors: null,
	data: null,
	message: null,
}

const Checkout = () => {
	// const [formState, formAction] = useFormState(loginUserAction, initialState)
	const [cartData, setCartData] = useState<CartType[]>([])
	const [presidiumData, setPresidiumData] = useState([])
	const [presidium, setPresidium] = useState(null)

	const fetchCartData = async () => {
		const authToken: string = Cookies.get("jwt")
		const { data } = await getStrapiCartData(`user-carts?filters[session_id][$eq]=${authToken}&populate=*`, authToken)
		setCartData(data)
	}

	useEffect(() => {
		fetchCartData()
	}, [])

	useEffect(() => {
		const fetchData = async () => {
			const response = await getStrapiData(`presidiums?populate=*`)
			setPresidiumData(response.data)
		}
		fetchData()
	}, [])

	console.log(presidium)

	const sum = () => {
		return cartData.map(cartItem => cartItem.attributes.price).reduce((acc, curr) => acc + curr, 0)
	}

	return (
		<article className="my-24 max-container mx-4">
			<h1>Bestellung</h1>
			<section className="mt-12">
				<p className="text-end">
					Endkosten: <b>{sum().toFixed(2).replace(".", ",")}&nbsp;€</b>
				</p>
			</section>
			<section className="flex flex-col items-center">
				<h2 className="mt-12">Anschrift:</h2>
				<form action={""} className="flex flex-col items-center mt-8 gap-y-4 w-full">
					<div className="grid grid-rows-[auto_1fr] justify-stretch gap-2 w-full">
						<label htmlFor="name">Vorname: *</label>
						<input id="name" name="name" required />
					</div>
					<div className="grid grid-rows-[auto_1fr] justify-stretch gap-2 w-full">
						<label htmlFor="surname">Nachname: *</label>
						<input id="surname" name="surname" required />
					</div>
					<div className="grid grid-rows-[auto_1fr] justify-stretch gap-2 w-full">
						<label htmlFor="phone">Telefon:</label>
						<input type="phone" id="phone" name="phone" />
					</div>
					<div className="grid grid-rows-[auto_1fr] justify-stretch gap-2 w-full">
						<label htmlFor="email">Email:</label>
						<input type="email" id="email" name="email" />
					</div>
					<div className={`grid grid-rows-[auto_1fr] justify-stretch gap-2 w-full ${presidium ? "" : "mb-16"}`}>
						<label htmlFor="hq">Präsidium:</label>
						<select defaultValue="" onChange={e => setPresidium(JSON.parse(e.target.value))}>
							<option value="" disabled hidden>
								Präsidium wählen
							</option>
							{presidiumData.length > 0 &&
								presidiumData.map(presidium => (
									<option key={presidium.id} value={JSON.stringify(presidium.attributes)}>
										{`${presidium.attributes.city} | ${presidium.attributes.title}`}
									</option>
								))}
						</select>
					</div>
					{presidium && (
						<div className="mb-16">
							<h2 className="mt-4 mb-2">Lieferadresse:</h2>
							<h3>{presidium.title}</h3>
							<p>{presidium.address}</p>
							<p>{presidium.city}</p>
						</div>
					)}
					<BaseButton isDisabled={useFormStatus.pending} buttonType="link" text="Zur Übersicht" linkPath="/fuer-legionaere-mariens/overview" />
				</form>
			</section>
		</article>
	)
}

export default Checkout
