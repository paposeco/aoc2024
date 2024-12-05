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

const findValidMulsAndCount = function (file: string): number {
  const str = prepFile(file);
  const muls = findMul(str);
  const regex = /mul\(\d{1,3},\d{1,3}\)/;
  let doTheMath = 0;
  for (let i = 0; i < muls.length; i++) {
    const maxWord = str.substring(muls[i], muls[i] + 12);
    console.log(maxWord);
    const valid = maxWord.search(regex);
    if (valid === 0) {
      const comma = maxWord.indexOf(",");
      const closingPara = maxWord.indexOf(")");
      const firstAlg = Number(maxWord.substring(4, comma));

      const secondAlg = Number(maxWord.substring(comma + 1, closingPara));
      doTheMath += firstAlg * secondAlg;
    }
  }
  return doTheMath;
};

const findValidMuls = function (file: string): number[] {
  const str = prepFile(file);
  const muls = findMul(str);
  const regex = /mul\(\d{1,3},\d{1,3}\)/;
  let validMuls: number[] = [];
  for (let i = 0; i < muls.length; i++) {
    const maxWord = str.substring(muls[i], muls[i] + 12);
    const valid = maxWord.search(regex);
    if (valid === 0) {
      validMuls.push(muls[i]);
    }
  }
  return validMuls;
};

interface DoDont {
  index: number;
  type: string;
}

const compareFn = function (obj1: DoDont, obj2: DoDont) {
  if (obj1.index < obj2.index) {
    return -1;
  } else if (obj1.index > obj2.index) {
    return 1;
  }
  return 0;
};

// preciso de guardar dos/donts e o index porque podem n\ao ser seguidos
const findDosDonts = function (file: string): DoDont[] {
  const str = prepFile(file);
  let indexes: DoDont[] = [];
  let currIndex = 0;
  while (currIndex < str.length) {
    let newIndex = str.indexOf("do()", currIndex);
    if (newIndex === -1) {
      break;
    }
    if (currIndex < newIndex) {
      indexes.push({ index: newIndex, type: "do" });
      currIndex = newIndex + 3;
    }
  }
  let currIndexN = 0;
  while (currIndexN < str.length) {
    let newIndex = str.indexOf("don't()", currIndexN);
    if (newIndex === -1) {
      break;
    }
    if (currIndexN < newIndex) {
      indexes.push({ index: newIndex, type: "dont" });
      currIndexN = newIndex + 3;
    }
  }

  return indexes.sort(compareFn);
};

const removeDisabledMuls = function (file: string) {
  const dosDonts = findDosDonts(file);
  // console.log(dosDonts);
  const validMuls = findValidMuls(file);
  let currIndex = 0;
  let lastValidIndex = 0;
  let indexDosDonts = 0;
  let doType = "do";
  let indexesToRemove: number[][] = [];

  while (currIndex < dosDonts[dosDonts.length - 1].index) {
    currIndex = dosDonts[indexDosDonts].index;
    // console.log(currIndex);
    if (dosDonts[indexDosDonts].type !== doType) {
      // change
      // console.log("change");
      doType = dosDonts[indexDosDonts].type;
      indexesToRemove.push([lastValidIndex, currIndex]);
      lastValidIndex = currIndex;
    } else {
    }
    ++indexDosDonts;
  }
  // console.log(indexesToRemove);
  //console.log(validMuls);
  const indextoremoveinmuls: number[] = [];
  for (let i = 1; i < indexesToRemove.length; i++) {
    // console.log("----------------");
    const beg = indexesToRemove[i][0];
    const end = indexesToRemove[i][1];

    // console.log(beg, end);
    for (let j = 0; j < validMuls.length; j++) {
      //   console.log("-----------------------");
      //  console.log(j);
      //isto n\ao est]a bem aqui. s]o esta a irbuscar indexes no inicio e no fim
      const currMul = validMuls[j];

      if (currMul > beg && currMul < end) {
        console.log(currMul);
        console.log("inside interval");
        indextoremoveinmuls.push(currMul);
      }
    }
  }
  //console.log(indextoremoveinmuls);
  return indextoremoveinmuls;
};

const doTheNewMath = function (file: string) {
  const indexestoremovefromvalidmuls = removeDisabledMuls(file);
  const str = prepFile(file);
  const validMuls = findValidMuls(file);
  let newValidMuls: number[] = [];

  let iCant: number[] = [];
  for (let k = 0; k < validMuls.length; k++) {
    const currValidMul = validMuls[k];
    console.log(currValidMul);
    const toBeRemoved = indexestoremovefromvalidmuls.includes(currValidMul);
    if (!toBeRemoved) {
      iCant.push(currValidMul);
    }
  }
  validMuls.forEach((mul) => {
    //  console.log(mul);
    if (indexestoremovefromvalidmuls.includes(mul)) {
    } else {
      //     console.log("push");
      newValidMuls.push(mul);
    }
  });
  console.log(newValidMuls.length, iCant.length);

  const regex = /mul\(\d{1,3},\d{1,3}\)/;
  let doTheMath = 0;
  for (let i = 0; i < newValidMuls.length; i++) {
    const maxWord = str.substring(newValidMuls[i], newValidMuls[i] + 12);
    //console.log(maxWord);
    const valid = maxWord.search(regex);
    if (valid === 0) {
      const comma = maxWord.indexOf(",");
      const closingPara = maxWord.indexOf(")");
      const firstAlg = Number(maxWord.substring(4, comma));

      const secondAlg = Number(maxWord.substring(comma + 1, closingPara));
      doTheMath += firstAlg * secondAlg;
    }
  }
  return doTheMath;
};

console.log(doTheNewMath("input.txt"));

// desliga no dont, ve qual ]e o proximo do e remove todos os muls entre esses indexes
