import Link from "next/link"

const Links = ({ title, links }) => {
	console.log({ links })
	return (
		<section className="mb-24">
			<h3>{title}</h3>
			<ul>
				{links.map(link => (
					<li className="my-4" key={link.id}>
						{link?.pdf?.data && (
							<a className="text-primary hover:text-accent transition-colors duration-300" href={`${process.env.API_URL}${link?.pdf?.data?.attributes?.url}`}>
								{link.name}
							</a>
						)}
						{link?.linkPath && (
							<Link className="text-primary hover:text-accent transition-colors duration-300" href={`${link.linkPath}`}>
								{link.name}
							</Link>
						)}
					</li>
				))}
			</ul>
		</section>
	)
}

export default Links
