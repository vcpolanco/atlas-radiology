export default async function CasoRxDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <main>
      <h1 style={{ fontSize: 26, margin: "8px 0" }}>Caso RX: {id}</h1>
      <p style={{ opacity: 0.8 }}>
        Acá va la imagen/visor, hallazgos, diagnóstico y puntos docentes.
      </p>
    </main>
  )
}
