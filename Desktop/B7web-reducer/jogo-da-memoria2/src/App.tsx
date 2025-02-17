"use client"
import { useEffect, useState } from 'react'
import * as C from './App.styles'
import logoImage from './assets/devmemory_logo.png'
import { InfoItem } from './components/InfoItem'
import { Button } from './components/Button'
import { GridItemTypes } from './types/GridItemTypes'
import { items } from './Data/items'
import { GridItem } from './components/GridItem'
import { fromatTimeElapsed } from './helpers/formatTimeElapsed'



const App = () => {

  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showCount, setShowCount] = useState<number>(0);
  const [gridItems, setGridsItems] = useState<GridItemTypes[]>([]);

  useEffect(() => resetAndCreateGrid(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (playing)  setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);

  // verify if opened are equal
  useEffect(() => {
    if(showCount === 2) {
      const opened = gridItems.filter(item => item.show === true)
      if(opened.length === 2) {
        // verify 1 - if both are equal, make every "show" permanent
        if(opened[0].item === opened[1].item) {
          const tmpGrid = [...gridItems];
          for(const i in tmpGrid) {
            if(tmpGrid[i].show) {
              tmpGrid[i].permanentShow = true;
              tmpGrid[i].show = false
            }
          }
          setGridsItems(tmpGrid);
          setShowCount(0);
        } 
        // verify 2 -if they are NOT equal, close all "show"        
        else {
          setTimeout(()=> {
            const tmpGrid = [...gridItems]
          for(const i in tmpGrid) {
            tmpGrid[i].show = false;
          }
          setGridsItems(tmpGrid);
          setShowCount(0);
        }, 1000);
        }

        setMoveCount(moveCount => moveCount +1)
      }
    }
  }, [showCount, gridItems])

  // verify if game if over
  useEffect(() => {
    if(moveCount > 0 && gridItems.every(item => item.permanentShow === true)) {
      setPlaying(false);
    }
  }, [moveCount, gridItems])



  const resetAndCreateGrid = () => {
    // step 1 - reset game
    setTimeElapsed(0);
    setMoveCount(0);
    setShowCount(0);

    // step 2 - create grid empty
    const tmpGrid: GridItemTypes[] = [];
    for(let i = 0; i < (items.length * 2); i++) {
      tmpGrid.push({
        item: null,
        show: false,
        permanentShow: false
      })
    }
    // step 2.1 - preencher o grid
    for (let w = 0; w < 2; w++){
      for (let i = 0; i < items.length; i++){
        let pos = -1;
        while(pos < 0 || tmpGrid[pos].item !== null){
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tmpGrid[pos].item = i;
      }
    }

    
    setGridsItems(tmpGrid);


    // step 3 - start game
    setPlaying(true);
  }


  const handleItemClick = (index: number) => {
    if (playing && index !== null && showCount < 2) {
      const tmpGrid = [...gridItems];

      if(tmpGrid[index].permanentShow === false && tmpGrid[index].show === false) {
        tmpGrid[index].show = true;
        setShowCount(showCount + 1);
      }
      setGridsItems(tmpGrid);
    }
  }

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} alt='' width="200" height=""/>
        </C.LogoLink>

        <C.InfoArea>
          showCount: {showCount}
          <InfoItem label='Tempo' value={fromatTimeElapsed(timeElapsed)}/>
          <InfoItem label='Movimentos' value={moveCount.toString()}/>
        </C.InfoArea>

        <Button label='Reiniciar' onClick={resetAndCreateGrid}/>
      </C.Info>

      <C.GridArea>
      <C.Grid>
          {gridItems.map((item, index) => (
            <GridItem
            key={index}
            item={item}
            onClick={() => handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  )
}

export default App