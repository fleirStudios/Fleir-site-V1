import { ContactDialogProvider } from '@/components/contact-dialog'
import { MorphSection } from '@/components/morph-section'
import { Contact } from '@/components/contact'

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
