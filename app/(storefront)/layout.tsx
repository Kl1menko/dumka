import { SiteHeader } from '@/components/SiteHeader'
import { CartProvider } from '@/components/CartProvider'
import { CurrencyProvider } from '@/components/CurrencyProvider'
import { SiteFooter } from '@/components/SiteFooter'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CurrencyProvider>
      <CartProvider>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </CartProvider>
    </CurrencyProvider>
  )
}
