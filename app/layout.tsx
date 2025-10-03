import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const IBMPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
  title: "Imaginify",
  description: "AI-powered image generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={"/"}
      appearance={{
        signIn: {
          variables: { colorPrimary: "#624cf5" },
        },
        signUp: {
          variables: { colorPrimary: "#624cf5" },
        },
      }}
    >
      <html lang="en">
        {/*NOTE: className => variable */}
        <body className={cn("font-IBMPlex antialiased", IBMPlex.className)}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
