import { ContactDialogProvider } from '@/components/contact-dialog'
import { Contact } from '@/components/contact'
import { MorphSection } from '@/components/morph-section'

export default function Page() {
  return (
    <ContactDialogProvider>
      <main>
        <MorphSection>
          <Contact />
        </MorphSection>
      </main>
    </ContactDialogProvider>
  )
}
