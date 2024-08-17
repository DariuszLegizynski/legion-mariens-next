import Image from "next/image"
import Link from "next/link"

const Footer = () => {
	const currentYear = new Date().getFullYear()
	return (
		<footer className="flex flex-col items-center justify-center text-primary bg-white py-8 border-t border-accent">
			<Link href="/" className="flex flex-col items-center justify-center">
				<Image className="h-16 w-auto" src="/images/Standarte_LM.svg" alt="Logo der Standarde von der Legion Mariens" width={32} height={60} />
				<span className="mt-4">© {currentYear} Legion-Mariens.at</span>
			</Link>
		</footer>
	)
}

export default Footer
