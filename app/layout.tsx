export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          height: '100dvh',
          overflow: 'hidden'
        }}
      >
        {children}
      </body>
    </html>
  )
}
