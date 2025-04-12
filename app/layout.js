import './globals.css';

export const metadata = {
  title: 'Arcanum',
  description: 'A mysterious medieval secret society',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Almendra&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}