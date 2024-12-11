import fs from "fs";

const prepFile = function (file: string): string[] {
  const fileToString: string = fs.readFileSync(file).toString();
  const puzzlelines: string[] = fileToString.split(/\r?\n/);
  return puzzlelines;
};

const mapLetters = function (file: string): Map<string, string> {
  const lines = prepFile(file);
  const letterMap = new Map<string, string>();
  for (let i = 0; i < lines.length; i++) {
    const line: string = lines[i];
    for (let j = 0; j < line.length; j++) {
      letterMap.set(`${j},${i}`, line[j]);
    }
  }
  return letterMap;
};

interface Location {
  xy: string;
  letter: string;
}

const locationsToCheck = function (initialcoord: string): Location[][] {
  const comma = initialcoord.indexOf(",");
  const x = Number(initialcoord.substring(0, comma));
  const y = Number(initialcoord.substring(comma + 1));
  const north: Location[] = [
    { xy: `${x},${y - 1}`, letter: "M" },
    { xy: `${x},${y - 2}`, letter: "A" },
    { xy: `${x},${y - 3}`, letter: "S" },
  ];

  const south: Location[] = [
    { xy: `${x},${y + 1}`, letter: "M" },
    { xy: `${x},${y + 2}`, letter: "A" },
    { xy: `${x},${y + 3}`, letter: "S" },
  ];
  const east: Location[] = [
    { xy: `${x + 1},${y}`, letter: "M" },
    { xy: `${x + 2},${y}`, letter: "A" },
    { xy: `${x + 3},${y}`, letter: "S" },
  ];
  const west: Location[] = [
    { xy: `${x - 1},${y}`, letter: "M" },
    { xy: `${x - 2},${y}`, letter: "A" },
    { xy: `${x - 3},${y}`, letter: "S" },
  ];
  const northwest: Location[] = [
    { xy: `${x - 1},${y - 1}`, letter: "M" },
    { xy: `${x - 2},${y - 2}`, letter: "A" },
    { xy: `${x - 3},${y - 3}`, letter: "S" },
  ];
  const northeast: Location[] = [
    { xy: `${x + 1},${y - 1}`, letter: "M" },
    { xy: `${x + 2},${y - 2}`, letter: "A" },
    { xy: `${x + 3},${y - 3}`, letter: "S" },
  ];
  const southwest: Location[] = [
    { xy: `${x - 1},${y + 1}`, letter: "M" },
    { xy: `${x - 2},${y + 2}`, letter: "A" },
    { xy: `${x - 3},${y + 3}`, letter: "S" },
  ];
  const southeast: Location[] = [
    { xy: `${x + 1},${y + 1}`, letter: "M" },
    { xy: `${x + 2},${y + 2}`, letter: "A" },
    { xy: `${x + 3},${y + 3}`, letter: "S" },
  ];
  return [north, south, east, west, northwest, northeast, southwest, southeast];
};

const checkLocationsOnMap = function (
  location: Location[],
  letterMap: Map<string, string>
) {
  let wordExists = true;
  for (let i = 0; i < location.length; i++) {
    const coord = location[i];
    if (letterMap.has(coord.xy)) {
      // console.log("tem");
      const letter = letterMap.get(coord.xy);

      if (letter !== coord.letter) {
        wordExists = false;
        break;
      }
    } else {
      wordExists = false;
      break;
    }
  }
  return wordExists;
};

const countXmas = function (file: string) {
  const lines = prepFile(file);
  const lettersMap = mapLetters(file);
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      if (line[j] !== "X") {
        continue;
      }
      const locations = locationsToCheck(`${j},${i}`);
      for (let k = 0; k < locations.length; k++) {
        const wordExists = checkLocationsOnMap(locations[k], lettersMap);
        if (wordExists) {
          ++count;
        }
      }
    }
  }
  return count;
};

//console.log(countXmas("input.txt"));
//console.log(mapLetters("inputmini.txt"));
// part 2

const locationsToCheckA = function (initialcoord: string): Location[][] {
  const comma = initialcoord.indexOf(",");
  const x = Number(initialcoord.substring(0, comma));
  const y = Number(initialcoord.substring(comma + 1));
  const masN = [
    { xy: `${x - 1},${y - 1}`, letter: "M" },
    { xy: `${x + 1},${y + 1}`, letter: "S" },
  ];
  const masS = [
    { xy: `${x - 1},${y + 1}`, letter: "M" },
    { xy: `${x + 1},${y - 1}`, letter: "S" },
  ];
  const samN = [
    { xy: `${x - 1},${y - 1}`, letter: "S" },
    { xy: `${x + 1},${y + 1}`, letter: "M" },
  ];
  const samS = [
    { xy: `${x - 1},${y + 1}`, letter: "S" },
    { xy: `${x + 1},${y - 1}`, letter: "M" },
  ];
  return [masN, masS, samN, samS];
};

const countAmas = function (file: string) {
  const lines = prepFile(file);
  const lettersMap = mapLetters(file);
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      if (line[j] !== "A") {
        continue;
      }
      const locations = locationsToCheckA(`${j},${i}`);
      let preCount = 0;
      for (let k = 0; k < locations.length; k++) {
        const wordExists = checkLocationsOnMap(locations[k], lettersMap);
        if (wordExists) {
          ++preCount;
        }
      }
      if (preCount === 2) {
        ++count;
      }
    }
  }
  return count;
};

console.log(countAmas("input.txt"));
