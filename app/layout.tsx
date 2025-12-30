export const metadata = {
  title: 'YouTube Auto Uploader',
  description: 'AI-powered automatic video scheduler and uploader',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>{children}</body>
    </html>
  )
}
