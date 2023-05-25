

export function GetRandomFruit(FRUITS,WEIGHTS,active){
    let weedweight = 1;
    let weeds = active.weed
    let totalweight =0
    let cutoff = {}
    for(let i=0;i<FRUITS.length;i++){
        totalweight = totalweight + WEIGHTS[FRUITS[i]] + (FRUITS[i]=='weed'?weeds*weedweight:0)
        cutoff[FRUITS[i]] = totalweight
    }
    let random = Math.random()*totalweight
    let chosen = ""
    for(let i=0;i<FRUITS.length;i++){
        if(chosen==""&&cutoff[FRUITS[i]]>=random){
            chosen=FRUITS[i]
        }
    }

    return chosen
}