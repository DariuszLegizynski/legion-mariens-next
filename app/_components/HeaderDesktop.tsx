"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import Cookies from "js-cookie"

import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import { logoutAction } from "@/app/_utils/actions/auth-actions"

// components
import BaseButton from "@/components/base/BaseButton"
import IconItems from "@/components/base/IconItems"

const HeaderDesktop = () => {
	const [isHeaderActive, setIsHeaderActive] = useState<boolean>(false)
	const [isUserIconActive, setIsUserIconActive] = useState<boolean>(false)
	const [headerData, setHeaderData] = useState([])
	const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

	useEffect(() => {
		const fetchData = async () => {
			const response = await getStrapiData(`header?populate[headerContent][populate][subCategory][populate]=pdf`)
			setHeaderData(response.data?.attributes?.headerContent)
		}

		fetchData()
	}, [])

	const isCookie = Cookies.get("jwt")
	useEffect(() => {
		setIsAuthenticated(Cookies.get("jwt") ? true : false)
	}, [isCookie])

	const handleLogout = async () => {
		try {
			await logoutAction()
			Cookies.remove("jwt")
		} catch (error) {
			console.error("Logout failed:", error)
		}
	}

	const handleCategoryClick = (categoryId: number | null = null) => {
		setIsUserIconActive(false)
		if (expandedCategoryId === categoryId) {
			setExpandedCategoryId(null)
		} else {
			setExpandedCategoryId(categoryId)
		}

		setIsHeaderActive(false)
	}

	return (
		<header className={`fixed top-0 left-0 items-center px-2 pt-4 pb-2 h-auto z-[5000] bg-white border-b-2 border-grey w-full hidden lg:block`}>
			<div className="max-container">
				<section className="grid grid-cols-[auto_auto_auto]">
					<Link href="/" onClick={() => handleCategoryClick(null)}>
						<Image className="h-8 w-auto" src="/images/Standarte_LM.svg" alt="Logo der Standarde von der Legion Mariens" width={32} height={60} />
					</Link>
					<nav className={`uppercase flex items-center justify-center`}>
						{headerData?.map((item, index) => (
							<div key={item.id + item.linkName} className="relative">
								{item.subCategory ? (
									<p
										onClick={() => handleCategoryClick(item.id + item.linkName)}
										className={`text-primary text-xs xl:text-sm cursor-pointer ${
											index === headerData.length - 1
												? ""
												: 'after:pl-[0.25rem] after:pr-[0.45rem] xl:after:pl-[0.35rem] xl:after:pr-[0.55rem] after:content-["|"]'
										}`}
									>
										{item.linkName}
									</p>
								) : (
									<Link onClick={() => handleCategoryClick(null)} href={`${item.linkPath}`}>
										<p
											className={`text-primary text-xs xl:text-sm ${
												index === headerData.length - 1
													? ""
													: 'after:pl-[0.25rem] after:pr-[0.45rem] xl:after:pl-[0.35rem] xl:after:pr-[0.55rem] after:content-["|"]'
											}`}
										>
											{item.linkName}
										</p>
									</Link>
								)}
								{item.subCategory && expandedCategoryId === item.id + item.linkName && (
									<ul className="text-start slide-in-from-top absolute top-[2.2rem] xl:top-[2.275rem] -left-8 bg-white z-[3000] px-8 pb-8 w-auto flex flex-col items-start gap-y-2 pt-3">
										<Link onClick={() => handleCategoryClick(null)} href={`${item.linkPath}`}>
											<p className={`text-primary cursor-pointer text-nowrap`}>{item.linkName}</p>
										</Link>
										{item.subCategory &&
											item.subCategory.map(subItem => (
												<li key={subItem.id + subItem.linkName}>
													{subItem.linkPath ? (
														<Link href={`${subItem?.linkPath}`} onClick={() => handleCategoryClick(null)}>
															<p className="text-primary text-nowrap">{subItem?.linkName}</p>
														</Link>
													) : subItem.pdf?.data?.attributes?.url ? (
														<a href={`${process.env.API_URL}${subItem?.pdf?.data?.attributes?.url}`} target="_blank" rel="noopener noreferrer">
															<p className="text-primary text-nowrap">{subItem?.linkName} (PDF)</p>
														</a>
													) : (
														<p className="text-primary text-nowrap">{subItem?.linkName} (Kein link verfügbar)</p>
													)}
												</li>
											))}
									</ul>
								)}
							</div>
						))}
					</nav>
					{isAuthenticated ? (
						<div
							className="cursor-pointer grid justify-items-end"
							onClick={() => {
								setIsUserIconActive(!isUserIconActive)
								setExpandedCategoryId(null)
							}}
						>
							<IconItems type="user" width="2rem" height="2rem" strokeColor="none" fillColor="#3C52A3" />
						</div>
					) : (
						<div />
					)}
				</section>
				<section>
					{isHeaderActive && (
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
										<Link onClick={() => handleCategoryClick(null)} href={`${item.linkPath}`}>
											<p className="text-primary cursor-pointer">{item.linkName}</p>
										</Link>
									)}
									{item.subCategory && expandedCategoryId === item.id + item.linkName && (
										<ul className="text-start slide-in-from-left">
											<Link onClick={() => handleCategoryClick(null)} href={`${item.linkPath}`}>
												<span className={`text-primary cursor-pointer`}>{item.linkName}</span>
											</Link>
											{item.subCategory &&
												item.subCategory.map(subItem => (
													<li key={subItem.id + subItem.linkName}>
														{subItem.linkPath ? (
															<Link href={`${subItem.linkPath}`} onClick={() => handleCategoryClick(null)}>
																<span className="text-primary">{subItem?.linkName}</span>
															</Link>
														) : subItem.pdf?.data?.attributes?.url ? (
															<a href={`${process.env.API_URL}${subItem?.pdf?.data?.attributes?.url}`} target="_blank" rel="noopener noreferrer">
																<span className="text-primary">{subItem?.linkName} (PDF)</span>
															</a>
														) : (
															<p className="text-primary">{subItem?.linkName} (No link available)</p>
														)}
													</li>
												))}
										</ul>
									)}
								</div>
							))}
						</nav>
					)}
					{isAuthenticated && isUserIconActive && (
						<nav className={`text-center uppercase grid justify-items-end gap-y-4 my-8 pr-2`}>
							<Link onClick={() => handleCategoryClick(null)} href="/fuer-legionaere-mariens/neuer-termin" className="max-w-72">
								<p className="text-primary">Neuer Termin</p>
							</Link>
							<Link href="/fuer-legionaere-mariens/cart" className="max-w-72" onClick={() => handleCategoryClick(null)}>
								<p className="text-primary">Warenkorb</p>
							</Link>
							<BaseButton onClick={handleLogout} buttonType="logout" text="Abmelden" />
						</nav>
					)}
				</section>
			</div>
		</header>
	)
}

export default HeaderDesktop
