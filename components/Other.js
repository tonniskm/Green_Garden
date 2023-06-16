export const FRUITS = {
'hot':['onion','bell_pepper','avocado','pepper'],
'wet':['banana','orange','pineapple','durian'],
'neutral':['corn','strawberry','apple','peach'],
'special':['sun','rain','weed']
}
const VALUES = [10,25,50,100]
export function GetRandomFruit(active){
    let chosen = ""

    const NEUTRAL_ODDS = [0,0,0.2,0.5,0.8,1,0.8,0.5,0.2,0,0]  //for neutral/hot/wet
    const FRUIT_ODDS = [[1,0,0,0],[.5,.4,.1,0],[.25,.5,.25,0],[1/6,1/3,1/3,1/6],[0.15,.25,.4,.2],[.05,.2,.45,.3]] //which rank

    let weeds = Math.min(5,active.weed)
    let suns = active.sun
    let rains = active.rain
    let weatherIntensity = Math.floor(Math.min(5,(suns+ rains)/2))
    let weatherOdds = [0,0.6,0.7,0.8,0.85,0.9] //odds of getting fruit instead
    let weatherState = suns - rains
    weatherState>5?weatherState=5:
    (weatherState<-5?weatherState=-5:{})
    //choose from weed/not weed
    let isweed = false
    let random = Math.random()
    if(random<=weeds/5+0.1){isweed=true;chosen='weed'}


    // if not a weed, choose whether it is weather or a fruit
  
    if(!isweed){
        let chosenType = ""
        random = Math.random()
        if(random>weatherOdds[weatherIntensity]){
            chosenType="weather"
        }else{chosenType="fruit"}
        if(chosenType=='weather'){
            random = Math.random()
            if(random>0.5-weatherState/10){chosen="rain"}else{chosen="sun"}
        }
        if(chosenType=='fruit'){
            let chosenArea = ""
            random = Math.random()
            let neutralOdds = NEUTRAL_ODDS[weatherState+5]
            random>=neutralOdds?(weatherState>0?chosenArea='hot':chosenArea='wet'):chosenArea="neutral"
            //choose fruit rank
            let weatherRank = 0
            if(chosenArea=='neutral'){
                weatherRank = weatherIntensity
            }else{
                weatherRank = Math.min(Math.abs(weatherState),5)
            }
            random = Math.random()
            let chosenRank = -1
            let odds = FRUIT_ODDS[weatherRank]
            let weightOdds = [odds[0]]
            for(let i=1;i<odds.length;i++){
                weightOdds[i]=weightOdds[i-1] + odds[i]
            }
            for(let i=0;i<4;i++){
                if(chosenRank<0&&random<=weightOdds[i]){
                    chosenRank=i
                }
            }
        chosen = FRUITS[chosenArea][chosenRank]               
        }
    }

return chosen
//return 'bell_pepper'
}

export function GetValue(fruit){
    let value = 0
    for(let i=0;i<Object.keys(FRUITS).length;i++){
        let thisType = Object.keys(FRUITS)[i]
        if(FRUITS[thisType].indexOf(fruit)>-1){//if fruit is in this type
            if(thisType=='special'){value=0}
            else{
                value = VALUES[FRUITS[thisType].indexOf(fruit)]
            }
        }
    }
return value
}


export function GetActiveCount(fruitStatus){
    let activeCount = 0
  for (let i=0;i<fruitStatus.length;i++){
    if(fruitStatus[i].current==true){
      activeCount = activeCount + 1
    }
  }
  return activeCount
}