export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, height: '100dvh', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
