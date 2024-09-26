"use client"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

import BaseButton from "@/components/base/BaseButton"
import { deleteStrapiAuthData, createStrapiAuthData, getStrapiAuthData, getStrapiData, updateStrapiAuthData } from "@/app/_utils/services/getStrapiData"

import type { Cart as CartType } from "@/types/Cart"
import { useRouter } from "next/navigation"

const Checkout = () => {
	const [cartData, setCartData] = useState<CartType[]>([])

	// Form
	const [name, setName] = useState("")
	const [surname, setSurname] = useState("")
	const [phone, setPhone] = useState("")
	const [email, setEmail] = useState("")
	const [address, setAddress] = useState("")
	const [place, setPlace] = useState("")
	const [legion, setLegion] = useState("")
	const [zip, setZip] = useState("")
	const [land, setLand] = useState("")

	const [loading, setLoading] = useState(false)

	const jwt: string = Cookies.get("jwt")
	const router = useRouter()

	const fetchCartData = async () => {
		const { data } = await getStrapiAuthData(`user-carts?filters[session_id][$eq]=${jwt}&populate=*`, jwt)
		setCartData(data)
	}

	useEffect(() => {
		fetchCartData()
	}, [])

	const sum = () => {
		return cartData.map(cartItem => cartItem?.attributes?.price).reduce((acc, curr) => acc + curr, 0)
	}

	const handleOrder = async () => {
		setLoading(true)

		const orderData = {
			data: {
				name: name,
				surname: surname,
				phone: phone,
				email: email,
				address: address,
				place: place,
				legion: legion,
				zip: zip,
				land: land,
				orderItemList: cartData.map(cartItem => ({
					product: cartItem.attributes?.product?.data[0].id,
					amount: cartItem.attributes?.amount,
					price: cartItem.attributes?.price,
				})),
			},
		}

		try {
			// Create the order in Strapi
			await createStrapiAuthData("orders", orderData, jwt)

			// Update product quantities in Strapi
			for (const cartItem of cartData) {
				const productId = cartItem?.attributes?.product?.data[0]?.id
				const purchasedAmount = cartItem?.attributes?.amount

				// Fetch current product data
				const productData = await getStrapiAuthData(`products/${productId}`, jwt)
				const currentQuantity = productData?.data?.attributes?.quantity

				const newQuantity = currentQuantity - purchasedAmount

				// Update product quantity in Strapi
				await updateStrapiAuthData(`products/${productId}`, { data: { quantity: newQuantity } }, jwt)
			}

			// Clear the cart
			for (const cartItem of cartData) {
				await deleteStrapiAuthData("user-carts", jwt!, cartItem.id)
			}

			setLoading(false)
			router.push("/fuer-legionaere-mariens/confirmation")
		} catch (error) {
			setLoading(false)
			console.error("Error during order processing: ", error.message)
			throw new Error("Fehler beim Hinzufügen zum Warenkorb: ", error.message)
		}
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
				<form className="grid grid-cols-1 sm:grid-cols-2 items-center mt-8 gap-4">
					<div className="grid grid-rows-[26px_1fr]  justify-center gap-2">
						<label htmlFor="name">Vorname: *</label>
						<input className="w-72 max-w-full" id="name" name="name" required onChange={e => setName(e.target.value)} />
					</div>
					<div className="grid grid-rows-[26px_1fr] justify-center gap-2 w-full">
						<label htmlFor="surname">Nachname: *</label>
						<input className="w-72 max-w-full" id="surname" name="surname" required onChange={e => setSurname(e.target.value)} />
					</div>
					<div className="grid grid-rows-[26px_1fr] justify-center gap-2 w-full">
						<label htmlFor="email">Anschrift: *</label>
						<textarea className="w-72 max-w-full" id="address" name="address" onChange={e => setAddress(e.target.value)} />
					</div>
					<div className="grid grid-rows-[26px_1fr] justify-center gap-2 w-full self-start">
						<label htmlFor="email">Ort: *</label>
						<input className="w-72 max-w-full" type="place" id="place" name="place" onChange={e => setPlace(e.target.value)} />
					</div>
					<div className="grid grid-rows-[26px_1fr] justify-center gap-2 w-full">
						<label htmlFor="email">Legionsrat:</label>
						<input className="w-72 max-w-full" type="legion" id="legion" name="legion" onChange={e => setLegion(e.target.value)} />
					</div>
					<div className="grid grid-rows-[26px_1fr] justify-center gap-2 w-full">
						<label htmlFor="email">PLZ: *</label>
						<input className="w-72 max-w-full" type="zip" id="zip" name="zip" onChange={e => setZip(e.target.value)} />
					</div>
					<div className="grid grid-rows-[26px_1fr] justify-center gap-2 w-full">
						<label htmlFor="email">Land:</label>
						<input className="w-72 max-w-full" type="land" id="land" name="land" onChange={e => setLand(e.target.value)} />
					</div>
					<div className="grid grid-rows-[26px_1fr] justify-center gap-2 w-full">
						<label htmlFor="phone">Telefon: *</label>
						<input className="w-72 max-w-full" type="phone" name="phone" required onChange={e => setPhone(e.target.value)} />
					</div>
					<div className="grid grid-rows-[26px_1fr] justify-center gap-2 w-full">
						<label htmlFor="email">Email:</label>
						<input className="w-72 max-w-full" type="email" id="email" name="email" onChange={e => setEmail(e.target.value)} />
					</div>
					<div className="col-span-full mx-auto mt-12">
						<BaseButton onClick={handleOrder} isDisabled={loading} buttonType="cart" text="Kostenpflichtig bestellen" />
					</div>
				</form>
			</section>
		</article>
	)
}

export default Checkout
