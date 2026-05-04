import { SiteHeader } from '@/components/SiteHeader'
import { CartProvider } from '@/components/CartProvider'
import { CurrencyProvider } from '@/components/CurrencyProvider'
import { WishlistProvider } from '@/components/WishlistProvider'
import { SiteFooter } from '@/components/SiteFooter'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CurrencyProvider>
      <CartProvider>
        <WishlistProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </WishlistProvider>
      </CartProvider>
    </CurrencyProvider>
  )
}
