import { SkillMemoryGame } from '../components/game/SkillMemoryGame'
import { GameScreenHeader } from '../components/game/GameScreenHeader'

export function StackMatchPage() {
  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 pb-16 pt-8 md:px-6 md:pt-12">
      <GameScreenHeader
        kicker="Mini-game"
        title="Memory match"
        description="Flip cards and find eight matching pairs — nature, places, and everyday words — shuffled every game."
      />
      <SkillMemoryGame />
    </main>
  )
}
