import fs from "fs";

const prepFile = function (file: string): string {
  const fileToString: string = fs.readFileSync(file).toString();
  return fileToString;
};

const findMul = function (str: string): number[] {
  let currIndex = 0;
  let mulLocations: number[] = [];
  while (currIndex < str.length) {
    const newIndex = str.indexOf("mul(", currIndex);
    if (newIndex === -1) {
      break;
    }
    if (currIndex < newIndex) {
      mulLocations.push(newIndex);
      currIndex = newIndex + 3;
    }
  }
  return mulLocations;
};

const findValidMuls = function (file: string): number {
  const str = prepFile(file);
  const muls = findMul(str);
  const regex = /mul\(\d{1,3},\d{1,3}\)/;
  let doTheMath = 0;
  for (let i = 0; i < muls.length; i++){
    const maxWord = str.substring(muls[i], muls[i]+12);
    console.log(maxWord)
    const valid = maxWord.search(regex) 
    if(valid === 0){
        const comma = maxWord.indexOf(",");
        const closingPara = maxWord.indexOf(")");
        const firstAlg = Number(maxWord.substring(4, comma));
        
        const secondAlg = Number(maxWord.substring(comma+1, closingPara));
        doTheMath += firstAlg*secondAlg
        console.log(firstAlg, secondAlg);
    }
  }
  return doTheMath
};

console.log(findValidMuls("input.txt"));
