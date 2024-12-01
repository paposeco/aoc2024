import fs from "fs";

const prepFile = function (file: string): number[][] {
  const fileToString: string = fs.readFileSync(file).toString();
  const leftlist: number[] = [];
  const rightlist: number[] = [];
  // o ? faz com que funcione em windows e linux
  const allIds: string[] = fileToString.split(/\r?\n/);
  allIds.pop();
  for(let i = 0; i< allIds.length; i++){
    const curr = allIds[i];
    const splitcurr = curr.split(" ");
    leftlist.push(Number(splitcurr[0]));
    rightlist.push(Number(splitcurr[splitcurr.length-1]));
  }
  return [leftlist, rightlist];
};

const calculateDistances = function(file:string): number{
    let distances: number = 0;
    const lists: number[][] = prepFile(file);
    const sortedLeftList = lists[0].sort();
    const sortedRightList = lists[1].sort();
    sortedLeftList.forEach((num, index) => distances += Math.abs(num - sortedRightList[index]))
    return distances
}

const similarityScore = function(file:string): number{
    let score: number = 0;
    const lists = prepFile(file);
    const leftList = lists[0];
    const rightlist = lists[1];
    const rightListmap = new Map<number, number>();

    for(let j = 0; j < rightlist.length; j++){
        const currNumber = rightlist[j];
        if(!rightListmap.has(currNumber)){
            rightListmap.set(currNumber, 1);
        }else{
            const currCount = rightListmap.get(currNumber);
            if(currCount){
                rightListmap.set(currNumber, currCount+1);
            }
        }
    }

    leftList.forEach((id) =>{
        const count = rightListmap.get(id);
        if(count){
            score += count * id
        }
    })
    return score;
}

console.log(similarityScore("input.txt"))