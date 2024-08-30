"use client"

const SearchProduct = ({ searchTerm, setSearchTerm }) => {
	return (
		<section className="relative flex justify-center">
			<div className="mb-5">
				<input
					type="text"
					id="search"
					name="search"
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					className="min-w-[19rem] mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					placeholder="Suche nach Titel oder Artikelnummer"
				/>
			</div>
		</section>
	)
}

export default SearchProduct
