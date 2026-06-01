import Desktop from '@/components/os/Desktop'
import ExperienceModal from '@/components/general/ExperienceModal'

export const dynamic = 'force-dynamic'

export default function OsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Desktop>{children}</Desktop>
      <ExperienceModal />
    </>
  )
}
