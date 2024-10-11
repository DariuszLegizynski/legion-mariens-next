"use client"

import { usePathname } from "next/navigation"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()

	const layoutClass = pathname === "/aufbau/legion-mariens-international" ? "" : "max-container"

	return <div className={layoutClass}>{children}</div>
}
