import fs from "fs";

const prepFile = function (file: string): number[][] {
  const fileToString: string = fs.readFileSync(file).toString();
  const reports: number[][] = [];
  // o ? faz com que funcione em windows e linux
  const allIds: string[] = fileToString.split(/\r?\n/);
  allIds.pop();
  for(let i = 0; i< allIds.length; i++){
    const curr = allIds[i];
    const splitcurr = curr.split(" ");
    let report: number[]= [];
    splitcurr.forEach((str) =>{
        report.push(Number(str));
    })
    reports.push(report);
  }
  return reports;
};


// tem de estar todos a subir ou descer
const checkReport = function(report: number[]): boolean{
    let validity = true;
    if(report[0] > report[1]){
        for(let i = 0; i < report.length-1; i++){
            const curr = report[i];
            const next = report[i+1];
            if((curr > next ) && (Math.abs(curr-next) >= 1 && Math.abs(curr-next) <= 3)){
                continue;
            }else{
                validity = false;
                break;
            }
        }   
    }else if(report[0] < report[1]){
        for(let i = 0; i < report.length-1; i++){
            const curr = report[i];
            const next = report[i+1];
            if((next > curr) && (Math.abs(curr-next) >= 1 && Math.abs(curr-next) <= 3)){
                continue;
            }else{
                validity = false;
                break;
            }
        }   
    }else{
        validity = false
        return validity;
    }
     

    return validity
}


const countValidReports = function(file: string): number{
    let count = 0;

    const reports = prepFile(file);
    reports.forEach((report) => {
        const validity = checkReport(report);
        if(validity){
            ++count
        }
    })
return count
}

const findUnsafeReports = function(file: string): number{
    const reports = prepFile(file);
    let unsafeReports:number[][] = []
    reports.forEach((report)=>{
        const validity = checkReport(report);
        if(!validity){
            unsafeReports.push(report)
        }
    })
    let count = 0;
    unsafeReports.forEach((report) =>{
        const checkifsafe = createSafeReport(report);
        if(checkifsafe){
            ++count;
        }
    })
    const safeReports = countValidReports(file);
    console.log(safeReports);
    console.log(count);
    return count+safeReports;
}



const createSafeReport = function(unsafereport: number[]){
    let report = [...unsafereport];
    for(let i = 0; i< unsafereport.length; i++){
        console.log("report: " + report + " " + i)
        report.splice(i,1);
        const isitsafe = checkReport(report);
        if(isitsafe){
            console.log(unsafereport)
            console.log(report)
            return true
        }else{
            report = [...unsafereport]
            continue;
        }
    }
    return false;
}

console.log(findUnsafeReports("input.txt"))