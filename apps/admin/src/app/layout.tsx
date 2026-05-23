import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "CoffeeFlow Admin",
    description:
        "Panel de control, inventario, menú y estados en vivo de la cafetería.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className="h-full antialiased">
            <body className="min-h-full bg-white text-slate-950">
                {children}
            </body>
        </html>
    );
}
