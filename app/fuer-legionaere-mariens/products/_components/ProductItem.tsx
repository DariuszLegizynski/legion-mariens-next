"use client"

import { FC, useState, useEffect } from "react"
import Image from "next/image"
import BaseButton from "@/components/base/BaseButton"
import type { Product } from "@/types/Product"

const ProductComponent: FC<{ productItem: Product; handleToCart: any; loading: boolean }> = ({ productItem, handleToCart, loading }) => {
	const [warehouseQuantity, setWarehouseQuantity] = useState<number>(productItem.attributes?.quantity)
	const [amount, setAmount] = useState<number>(0)
	const [endPrice, setEndPrice] = useState<number>(0)

	const handleDecrease = () => {
		if (amount > 0) {
			setAmount(prevAmount => prevAmount - 1)
			setWarehouseQuantity(prevQuantity => prevQuantity + 1)
		}
	}

	const handleIncrease = () => {
		if (warehouseQuantity > 0) {
			setAmount(prevAmount => prevAmount + 1)
			setWarehouseQuantity(prevQuantity => prevQuantity - 1)
		}
	}

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = parseInt(e.target.value, 10)
		if (isNaN(value)) value = 0 // Handle non-numeric inputs
		if (value < 0) value = 0 // Ensure the amount is not negative
		if (value > productItem.attributes?.quantity) value = productItem.attributes?.quantity // Limit to available stock

		setAmount(value)
		setWarehouseQuantity(productItem.attributes?.quantity - value) // Adjust warehouse quantity
	}

	useEffect(() => {
		setEndPrice(amount * productItem.attributes?.price)
	}, [amount])

	return (
		<article className="border border-grey rounded-lg p-2 max-w-64 w-full sm:max-w-72 h-full">
			<Image
				className="h-80 p-1.5 w-full object-contain mx-auto"
				src={`${process.env.API_URL}${productItem.attributes?.image.data?.attributes?.url}`}
				alt={`${process.env.API_URL}/${productItem.attributes?.image.data?.attributes?.alternativeText}`}
				width={800}
				height={1600}
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
						<div className="grid grid-cols-[1fr_auto_1fr] border">
							<button className="px-3 py-1.5" onClick={handleDecrease}>
								-
							</button>
							<input
								type="number"
								className="text-center !min-w-max !p-0 !border-none"
								value={amount}
								onChange={handleAmountChange}
								min={0}
								max={productItem.attributes?.quantity}
							/>
							<button className="px-3 py-1.5" onClick={handleIncrease}>
								+
							</button>
						</div>
						<b>&nbsp;=&nbsp;€&nbsp;{endPrice.toFixed(2).replace(".", ",")}</b>
					</div>
				</div>
				<div className="flex flex-col items-center w-full mt-4">
					<BaseButton
						onClick={() => handleToCart(productItem, amount, warehouseQuantity)}
						isDisabled={loading || amount <= 0}
						buttonType="cart"
						text="Zum Warenkorb"
						iconType="cart"
						width="1.4rem"
						height="1.4rem"
						fillColor="white"
						fontFamily="Open-Sans, sans-serif"
						textSize="0.95rem"
						className="bg-primary hover:bg-primary-800"
					/>
				</div>
			</section>
		</article>
	)
}

export default ProductComponent
