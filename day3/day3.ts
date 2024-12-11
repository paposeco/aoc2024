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

const findMulsIndexesBetweenDos = function (
  validMuls: number[],
  dosIntervals: number[]
) {
  let muls: number[] = [];
  for (let i = 0; i < validMuls.length; i++) {
    const currValidMulIndex = validMuls[i];
    if (currValidMulIndex < dosIntervals[0]) {
      continue;
    } else if (currValidMulIndex > dosIntervals[1]) {
      // se a string continuar depois do do, nao estou a cntab
      break;
    }
    muls.push(currValidMulIndex);
  }
  return muls;
};

const findMulsBetweenDos = function (
  stringlength: number,
  validMuls: number[],
  dosDotsIndexes: DoDont[]
) {
  let currentType = "do";
  let prevIndex = -1;
  let mulsToCount: number[][] = [];

  for (let i = 0; i < dosDotsIndexes.length; i++) {
    const index = dosDotsIndexes[i].index;
    const type = dosDotsIndexes[i].type;
    if (currentType === type) {
      continue;
    }
    currentType = type;
    if (type === "dont") {
      // calculate
      const interval = [prevIndex, index];
      const muls = findMulsIndexesBetweenDos(validMuls, interval);
      mulsToCount.push(muls);
    } else {
      prevIndex = index;
      if (i === dosDotsIndexes.length - 1) {
        console.log("here");
        const interval = [index, stringlength - 1];
        console.log(interval);
        const muls = findMulsIndexesBetweenDos(validMuls, interval);
        mulsToCount.push(muls);
      }
    }
  }
  return mulsToCount;
};

const newCalculation = function (file: string) {
  const validMuls = findValidMuls(file);
  const str = prepFile(file);
  const dosAndDonts = findDosDonts(file);
  const finalValidMuls = findMulsBetweenDos(
    str.length,
    validMuls,
    dosAndDonts
  ).flat();
  const regex = /mul\(\d{1,3},\d{1,3}\)/;
  let doTheMath = 0;

  for (let i = 0; i < finalValidMuls.length; i++) {
    const maxWord = str.substring(finalValidMuls[i], finalValidMuls[i] + 12);
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

console.log(newCalculation("input.txt"));
