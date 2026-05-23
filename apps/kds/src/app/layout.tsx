import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "CoffeeFlow KDS",
    description: "Pantalla en tiempo real para preparar y despachar pedidos.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className="h-full antialiased">
            <body className="min-h-full bg-slate-950 text-slate-50">
                {children}
            </body>
        </html>
    );
}
