import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/SiteHeader'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const cormorant = Cormorant_Garamond({ 
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant' 
})

export const metadata: Metadata = {
  title: 'DUMKA by Nadiya Dumka | Маки 2026',
  description: 'Premium womenswear, showroom in Lviv, and the Maky Spring-Summer 2026 collection.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} ${cormorant.variable} bg-white font-sans text-[#111111] antialiased`}>
        <SiteHeader />

        <main>{children}</main>

        <footer className="mx-auto mt-24 grid max-w-7xl grid-cols-1 gap-12 border-t border-[#111111]/10 px-4 py-16 md:grid-cols-[1.2fr_1fr] md:px-8">
          <div className="max-w-md">
            <h3 className="mb-6 font-serif text-3xl uppercase">Dumka</h3>
            <p className="text-sm leading-7 text-[#111111]/65">
              Речі для подій, що залишаються у пам'яті. Шоурум у ТЦ "Магнус",
              індивідуальна примірка та уважний сервіс.
            </p>
            <div className="mt-8 space-y-2 text-sm text-[#111111]/65">
              <p>вул. Шпитальна, 1, Львів</p>
              <p>“Магнус”, 3-й поверх</p>
              <p>dumkaprotebe@gmail.com</p>
              <p>+38 (067) 757-01-21</p>
            </div>
            <form className="mt-10 max-w-sm">
              <label className="floating-field">
                <input placeholder=" " type="email" />
                <span>Email для листа з колекцією</span>
              </label>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-8 text-xs uppercase">
            <ul className="space-y-5">
              <li><a href="#collection" className="luxury-link">Колекція</a></li>
              <li><a href="#showroom" className="luxury-link">Шоурум</a></li>
              <li><a href="#lookbook" className="luxury-link">Lookbook</a></li>
              <li><a href="#" className="luxury-link">Медіа</a></li>
            </ul>
            <ul className="space-y-5">
              <li><a href="#" className="luxury-link">Доставка</a></li>
              <li><a href="#" className="luxury-link">Повернення</a></li>
              <li><a href="https://www.instagram.com/nadiya_dumka/" className="luxury-link">Instagram</a></li>
              <li><a href="#" className="luxury-link">Партнерам</a></li>
            </ul>
          </div>
        </footer>
      </body>
    </html>
  )
}
