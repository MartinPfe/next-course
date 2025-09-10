import "@/app/ui/global.css"
import { inter } from '@/app/ui/fonts';
import { Auth0Provider } from "@auth0/nextjs-auth0";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Auth0Provider>
          {children}
        </Auth0Provider>
      </body>
    </html>
  );
}
