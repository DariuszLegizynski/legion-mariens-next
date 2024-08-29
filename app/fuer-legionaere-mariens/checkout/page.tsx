"use client"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

import BaseButton from "@/components/base/BaseButton"
import { deleteStrapiAuthData, createStrapiAuthData, getStrapiAuthData, getStrapiData, updateStrapiAuthData } from "@/app/_utils/services/getStrapiData"

import type { Cart as CartType } from "@/types/Cart"
import { useRouter } from "next/navigation"

const Checkout = () => {
	const [cartData, setCartData] = useState<CartType[]>([])
	const [presidiumData, setPresidiumData] = useState([])
	const [presidium, setPresidium] = useState(null)

	// Form
	const [name, setName] = useState("")
	const [surname, setSurname] = useState("")
	const [phone, setPhone] = useState("")
	const [email, setEmail] = useState("")

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

	useEffect(() => {
		const fetchData = async () => {
			const response = await getStrapiData(`presidiums?populate=*`)
			setPresidiumData(response.data)
		}
		fetchData()
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
				presidium: presidium?.id,
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
				const currentQuantity = productData.data.attributes?.quantity

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
				<form className="flex flex-col items-center mt-8 gap-y-4 w-full">
					<div className="grid grid-rows-[auto_1fr] justify-stretch gap-2 w-full">
						<label htmlFor="name">Vorname: *</label>
						<input id="name" name="name" required onChange={e => setName(e.target.value)} />
					</div>
					<div className="grid grid-rows-[auto_1fr] justify-stretch gap-2 w-full">
						<label htmlFor="surname">Nachname: *</label>
						<input id="surname" name="surname" required onChange={e => setSurname(e.target.value)} />
					</div>
					<div className="grid grid-rows-[auto_1fr] justify-stretch gap-2 w-full">
						<label htmlFor="phone">Telefon:</label>
						<input type="phone" id="phone" name="phone" onChange={e => setPhone(e.target.value)} />
					</div>
					<div className="grid grid-rows-[auto_1fr] justify-stretch gap-2 w-full">
						<label htmlFor="email">Email:</label>
						<input type="email" id="email" name="email" onChange={e => setEmail(e.target.value)} />
					</div>

					<div className={`grid grid-rows-[auto_1fr] justify-stretch gap-2 w-full ${presidium ? "" : "mb-16"}`}>
						<label htmlFor="hq">Präsidium:</label>
						<select defaultValue="" onChange={e => setPresidium(JSON.parse(e.target.value))} required>
							<option value="" disabled hidden>
								Präsidium wählen
							</option>
							{presidiumData.length > 0 &&
								presidiumData.map(presidium => (
									<option key={presidium?.id} value={JSON.stringify(presidium)}>
										{`${presidium?.attributes?.city} | ${presidium?.attributes?.title}`}
									</option>
								))}
						</select>
					</div>
					{presidium && (
						<div className="mb-16">
							<h2 className="mt-4 mb-2">Lieferadresse:</h2>
							<h3>{presidium?.attributes?.title}</h3>
							<p>{presidium?.attributes?.address}</p>
							<p>{presidium?.attributes?.city}</p>
						</div>
					)}
					<BaseButton onClick={handleOrder} isDisabled={loading} buttonType="cart" text="Kostenpflichtig bestellen" />
				</form>
			</section>
		</article>
	)
}

export default Checkout
