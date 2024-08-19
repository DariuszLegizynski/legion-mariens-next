"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

import { getStrapiData } from "@/app/_utils/getStrapiData"
import { logoutAction } from "@/app/_utils/actions/auth-actions"

// components
import Burger from "@/app/_components/burger/Burger"
import IconItems from "@/components/base/IconItems"
import BaseButton from "@/components/base/BaseButton"

const HeaderMobile = () => {
	const [isActive, setIsActive] = useState<boolean>(false)
	const [isLoginActive, setIsLoginActive] = useState<boolean>(false)
	const [headerData, setHeaderData] = useState([])
	const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null)

	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

	useEffect(() => {
		const fetchData = async () => {
			const response = await getStrapiData(`header?populate[headerContent][populate]=*`)
			setHeaderData(response.data.attributes.headerContent)
		}

		fetchData()
	}, [])

	useEffect(() => {
		const allCookies = document.cookie
		const jwtCookie = allCookies.split("; ").find(row => row.startsWith("jwt="))

		if (jwtCookie) {
			setIsAuthenticated(jwtCookie.split("=")[1] ? true : false)
		}
	}, [isAuthenticated])

	const handleCategoryClick = (categoryId: number) => {
		if (expandedCategoryId === categoryId) {
			setExpandedCategoryId(null)
		} else {
			setExpandedCategoryId(categoryId)
		}
	}

	console.log({ isAuthenticated })

	return (
		<header className={`fixed top-0 left-0 items-center px-2 pt-4 pb-2 h-auto z-10 bg-white border-b-2 border-grey w-full lg:hidden`}>
			<section className="grid grid-cols-[1fr_1fr_1fr]">
				<div
					onClick={() => {
						setIsActive(!isActive)
						setIsLoginActive(false)
					}}
				>
					<Burger isActive={isActive} />
				</div>
				<Link href="/">
					<Image className="h-8 mx-auto" src="/images/Standarte_LM.svg" alt="Logo der Standarde von der Legion Mariens" width={32} height={60} />
				</Link>
				{isAuthenticated && (
					<div
						className="cursor-pointer grid justify-items-end"
						onClick={() => {
							setIsLoginActive(!isLoginActive)
							setIsActive(false)
						}}
					>
						<IconItems type="user" width="2rem" height="2rem" strokeColor="none" fillColor="#3C52A3" />
					</div>
				)}
			</section>
			<section>
				{isActive && (
					<nav className={`text-left uppercase grid gap-y-4 max-w-[72vw] mx-auto my-8`}>
						{headerData?.map(item => (
							<div key={item.id + item.linkName}>
								{item.subCategory ? (
									<div onClick={() => handleCategoryClick(item.id + item.linkName)}>
										<p className={`text-primary cursor-pointer flex`}>
											{item.linkName}
											<IconItems
												type="rarr"
												fillColor="#3C52A3"
												width="1.4rem"
												height="1.4rem"
												rotation={expandedCategoryId === item.id + item.linkName ? true : false}
											/>
										</p>
									</div>
								) : (
									<Link onClick={() => handleCategoryClick(item.id + item.linkName)} href={`${item.linkPath}`}>
										<p className="text-primary cursor-pointer">{item.linkName}</p>
									</Link>
								)}
								{item.subCategory && expandedCategoryId === item.id + item.linkName && (
									<ul className="text-start slide-in-from-left">
										<Link onClick={() => handleCategoryClick(item.id + item.linkName)} href={`${item.linkPath}`}>
											<span className={`text-primary cursor-pointer`}>{item.linkName}</span>
										</Link>
										{item.subCategory &&
											item.subCategory.map(subItem => (
												<li key={subItem.id + subItem.linkName}>
													<Link href={`${subItem.linkPath}`}>
														<span className="text-primary">{subItem.linkName}</span>
													</Link>
												</li>
											))}
									</ul>
								)}
							</div>
						))}
					</nav>
				)}
				{isAuthenticated && isLoginActive && (
					<nav className={`text-center uppercase grid justify-items-end gap-y-4 my-8`}>
						<Link href="/cart" className="w-full max-w-72">
							<p className="text-primary">Warenkorb</p>
						</Link>
						<BaseButton onClick={logoutAction} buttonType="logout" text="Abmelden" />
					</nav>
				)}
			</section>
		</header>
	)
}

export default HeaderMobile
