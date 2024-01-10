import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import UserSession from "./session";
import Logo from "./_components/ui/icons/logo";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
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
						<div className='pl-6 pr-6 w-100 h-16 flex justify-between items-center'>
							<Link href="/">
								<Logo />
							</Link>
							<UserSession />
						</div>
						{children}
					</main>
				</Providers>
			</body>
		</html>
	);
}
