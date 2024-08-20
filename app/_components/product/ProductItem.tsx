"use client"

import { FC, useState, useEffect } from "react"
import Cookies from "js-cookie"

import type { Product } from "@/types/Product"
import Image from "next/image"
import BaseButton from "@/components/base/BaseButton"
import { postStrapiAuthData } from "@/app/_utils/services/getStrapiData"

const ProductComponent: FC<{ productItem: Product }> = ({ productItem }) => {
	const [warehouseQuantity, setWarehouseQuantity] = useState<number>(productItem.attributes?.quantity)
	const [amount, setAmount] = useState<number>(0)
	const [endPrice, setEndPrice] = useState<number>(0)
	const [loading, setLoading] = useState<boolean>(false)

	const handleDecrease = () => {
		if (amount > 0) {
			setAmount(amount - 1)
			setWarehouseQuantity(warehouseQuantity + 1)

			return
		}
		setAmount(0)
		setWarehouseQuantity(warehouseQuantity)
	}

	const handleIncrease = () => {
		if (warehouseQuantity > 0) {
			setAmount(amount + 1)
			setWarehouseQuantity(warehouseQuantity - 1)

			return
		}
		setAmount(0)
		setWarehouseQuantity(warehouseQuantity)
	}

	const calculateEndPrice = () => {
		setEndPrice(amount * productItem.attributes?.price)
	}

	useEffect(() => {
		calculateEndPrice()
	}, [amount])

	const jwt = Cookies.get("jwt")
	const handleToCart = async () => {
		setLoading(true)

		const data = {
			data: {
				products: productItem.id,
				amount: amount,
				price: endPrice.toFixed(2),
				quantity: warehouseQuantity,
				session_id: jwt,
			},
		}
		try {
			await postStrapiAuthData("user-carts", data, jwt)
				.then(res => res)
				.catch(err => err)
			setLoading(false)
		} catch (error: any) {
			setLoading(false)
			throw new Error("Fehler beim Hinzufügen zum Warenkorb: ", error.message)
		}
	}

	return (
		<article className="border border-grey rounded-lg p-2 max-w-64 w-full sm:max-w-72 h-full">
			<Image
				className="h-80 p-1.5 w-full object-contain mx-auto"
				src={`${process.env.API_URL}${productItem.attributes.image.data.attributes.url}`}
				alt={`${process.env.API_URL}/${productItem.attributes.image.data.attributes.alternativeText}`}
				width={100}
				height={200}
			/>
			<section className="flex flex-col justify-between">
				<div className="mt-4 grid grid-rows-[auto_auto_auto] sm:grid-rows-[auto_auto_102px]">
					<i>{productItem.attributes?.product_category?.data?.attributes?.name}</i>
					<p className="mt-2">Best.Nr: {productItem.attributes?.article_code}</p>
					<h2 className="!capitalize text-lg max-w-60" style={{ fontFamily: "Open-Sans, sans-serif" }}>
						{productItem.attributes?.title}
					</h2>
				</div>
				<p className="flex mt-4 justify-end">
					Preis:&nbsp;<b>€&nbsp;{productItem.attributes?.price.toFixed(2).replace(".", ",")}</b>&nbsp;/&nbsp;pro Stück
				</p>
				<div className="flex flex-col mt-4">
					<p>Auf Lager: {warehouseQuantity}</p>
					<div className="flex justify-start items-center my-4">
						<div className="grid grid-cols-3 border">
							<button className="px-4 py-2" onClick={handleDecrease}>
								-
							</button>
							<p className="px-4 py-2">{amount}</p>
							<button className="px-4 py-2" onClick={handleIncrease}>
								+
							</button>
						</div>
						<b>&nbsp;=&nbsp;€&nbsp;{endPrice.toFixed(2).replace(".", ",")}</b>
					</div>
				</div>
				<div className="flex flex-col items-center w-full mt-4">
					<BaseButton
						onClick={handleToCart}
						isDisabled={loading}
						buttonType="cart"
						text="Zum Warenkorb"
						iconType="cart"
						width="1.4rem"
						height="1.4rem"
						fillColor="white"
						strokeColor="none"
					/>
					{loading && <p className="mt-2 text-center">Lade...</p>}
				</div>
			</section>
		</article>
	)
}

export default ProductComponent
