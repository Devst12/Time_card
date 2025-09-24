import "./globals.css";
import SessionProvider from "@/app/componnets/SessionProvider";
import NavBar from "@/app/componnets/Navbar";

export const metadata = {
  title: "Time card  ",
  description: "Time card",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body> 
        <SessionProvider> 
          <NavBar/>     
        {children}
        </SessionProvider>

      </body>
    </html>
  );
}
