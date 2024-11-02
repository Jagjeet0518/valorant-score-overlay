import "./globals.css";

export const metadata = {
  title: "Valorant Overlay",
  description: "Valorant Overlay",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
