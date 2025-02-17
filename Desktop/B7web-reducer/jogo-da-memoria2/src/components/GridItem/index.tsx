import { GridItemTypes } from '../../types/GridItemTypes'
import * as C from './styles'
import b7Svg from '../../assets/svgs/b7.svg'
import { items } from '../../Data/items'

type Props = {
    item: GridItemTypes,
    onClick: () => void
}

export const GridItem = ({ item, onClick }: Props) => {
    return (
        <C.Container 
        onClick={onClick}>
            {item.permanentShow === false && item.show === false && 
                <C.Icon src={b7Svg} alt="" opacity={1.1} />
            }
            {(item.permanentShow || item.show) && item.item !== null &&
                <C.Icon src={items[item.item].icon} alt=''/>
            }
        </C.Container>
    )
}