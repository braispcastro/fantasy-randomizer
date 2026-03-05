import styles from './DrawContainer.module.css'
import ProgressiveReveal from './animations/ProgressiveReveal'
import Roulette from './animations/Roulette'
import FlippedCards from './animations/FlippedCards'
import RiggedButton from './RiggedButton'

export default function DrawContainer({ draw, isAdmin, onRevealNext, onRevealCard }) {
  const { config, result, currentReveal, revealedCards } = draw

  const sharedProps = {
    participants: config.participants,
    result,
    currentReveal,
    isAdmin,
    onRevealNext,
  }

  return (
    <div className={styles.container}>
      {config.animationType === 'progressive' && <ProgressiveReveal {...sharedProps} />}
      {config.animationType === 'roulette' && <Roulette {...sharedProps} />}
      {config.animationType === 'flipped' && (
        <FlippedCards
          result={result}
          revealedCards={revealedCards ?? []}
          isAdmin={isAdmin}
          onRevealCard={onRevealCard}
        />
      )}
      <RiggedButton />
    </div>
  )
}
