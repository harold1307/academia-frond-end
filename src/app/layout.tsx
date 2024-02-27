import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

import Logo from "./_components/ui/icons/logo";
import { Toaster } from "./_components/ui/toaster";
import "./globals.css";
import Providers from "./providers";
import UserSession from "./session";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Tecdu",
	description: "Futuro academico",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={inter.className + " dark"}>
				<Providers>
					<main className='p-6'>
						<header className='w-100 mb-6 flex h-16 items-center justify-between pl-6 pr-6'>
							<Link href='/'>
								<Logo />
							</Link>
							<UserSession />
						</header>
						{children}
					</main>
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
