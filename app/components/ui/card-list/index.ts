import { Card, CardContext } from './card'
import { CardList as CardListComponent, CardListContext } from './list'

const CardList = Object.assign(CardListComponent, {
  Card: Object.assign(Card, {
    Context: CardContext,
  }),
  Context: CardListContext,
})

export { CardList }
