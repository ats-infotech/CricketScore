'use client'
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import TeamScoreBanner from "./(page)";

export default function RootLayout({ children }) {
    const path = usePathname()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0)
        }
    }, [path])

    return (
        <>
            <TeamScoreBanner />
            {children}
        </>
    )
}