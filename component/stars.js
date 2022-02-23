import React, { useRef, useEffect, useState } from "react";
import { View } from "react-native";
import StarIcon from "./star";

export default function Stars({style, point}) {
   
  
    let [arrayStar, setArray] = useState([])
    // const [num, setNum] = useState(2)
    // const rotateTemplate = [-20, 0 , 20]
    const itemConfig = [
        {rot: -20, scale: 1},
        {rot: 0, scale: 1.5},
        {rot: 20, scale: 1},
    ]
    
    
    useEffect(()=> {
      updateStar()
      return(()=> {
        updateStar()
      })
    },[point])
  
  
    function updateStar() {
      let _arr = []
      setArray(_arr)
      for(let c=0; c < point; c++) {
        setArray(arrayStar => [...arrayStar, itemConfig[c]])
      }
    }
  
    return (
      <View style={{flexDirection: 'row'}}>

          {
            arrayStar.map((star, index) => {
              return (  
                <StarIcon width="60" height="60" rotation={arrayStar.length === 3 ? star.rot : 0} scale={arrayStar.length === 3 && index === 1 ? 1.5 : 1} key={index} style={{alignSelf: 'center'}} />
              )
            })
          }
        
      </View>
    )
  }