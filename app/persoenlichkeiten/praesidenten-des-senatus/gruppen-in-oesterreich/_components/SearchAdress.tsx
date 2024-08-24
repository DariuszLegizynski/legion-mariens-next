"use client"

import { useState, useRef, useEffect } from "react"

const SearchAddress = ({ presidiumData, setSelectedPresidium }) => {
	const [searchTerm, setSearchTerm] = useState("")
	const [isDropdownVisible, setIsDropdownVisible] = useState(false)
	const dropdownRef = useRef(null)

	const searchWords = searchTerm.toLowerCase().split(" ").filter(Boolean)

	const filteredPresidium = presidiumData.filter(({ attributes }) => {
		const { address, city, title } = attributes
		const searchableText = `${address} ${city} ${title}`.toLowerCase()

		return searchWords.every(word => searchableText.includes(word))
	})

	useEffect(() => {
		const handleClickOutside = event => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownVisible(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [])

	const handleOptionSelect = selectedOption => {
		setSearchTerm(`${selectedOption.attributes?.title} - ${selectedOption.attributes?.address}, ${selectedOption.attributes?.city}`)
		setSelectedPresidium(selectedOption)
		setIsDropdownVisible(false)
	}

	return (
		<section className="relative">
			<div className="mb-5">
				<input
					type="text"
					id="search"
					name="search"
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					onFocus={() => setIsDropdownVisible(true)}
					className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					placeholder="Suche nach Adresse, Stadt oder Titel"
				/>
			</div>
			{isDropdownVisible && (
				<div ref={dropdownRef} className="absolute top-10 max-h-72 overflow-y-auto border border-gray-300 rounded-md z-[2000] bg-white">
					<ul className="block w-full text-sm">
						{filteredPresidium.length > 0 ? (
							filteredPresidium.map(item => (
								<li key={item.id} onClick={() => handleOptionSelect(item)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
									{item.attributes?.title} - {item.attributes?.address}, {item.attributes?.city}
								</li>
							))
						) : (
							<li className="px-4 py-2 text-gray-500">Keine Ergebnisse gefunden</li>
						)}
					</ul>
				</div>
			)}
		</section>
	)
}

export default SearchAddress
