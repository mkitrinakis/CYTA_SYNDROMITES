

//import * as fs from 'fs'; 
//import { forEach } from 'lodash';


export  type DocumentSetType = {
  Title: string;
  CustomerName: string; 
  StatusDocSet: string; 
  CustomerID1 : string; 
  DateSend: Date | null; 
  Lawyer: string ; 
}

export abstract class CsvUtils {

 public static processCsv(file: File, csvCheck:HTMLDivElement, libraryName: string, callback: (rs : DocumentSetType[], csvCheck:HTMLDivElement, libraryName: string) => Promise<void>) :void {
  console.log ()
let result: DocumentSetType[] = []; 
//let finished : boolean = false ; 
  const fileReader = new FileReader();
 //let rs:string = 'to process!'; 
  fileReader.onload = () => {
     const fileContent = fileReader.result as string;
     const rows = fileContent.split(/\r\n|\r|\n/);
     

     
      let rs:string = '<table>' ; 
     for (let i = 0; i < rows.length; i++) {
      rs+= '<tr>' ;
        const columns = rows[i].split(';');
        columns.forEach(c => rs+= '<td>' + c + '</td>') ; 
        rs+= '</tr>' ;
// console.log(columns[0]); 
// console.log(columns[2]); 
let entry: DocumentSetType = { Title:columns[0].trim(), CustomerName:columns[1].trim(), StatusDocSet: columns[2].trim(), DateSend: CsvUtils.getDate(columns[4].trim(), columns[1].trim()),  CustomerID1 :  columns[3].trim(), Lawyer : columns[5].trim() }; 

result.push(entry);
     }
     callback(result, csvCheck, libraryName) ; 
     rs += '<table>' ; 
   //  finished = true; 
      
  };

 fileReader.readAsText(file, 'utf-8' );
}


private static getDate(val : string, valid: string ) : Date | null {
  try {
val = val.split(' ')[0]; 
let parts : string[] = val.split('/'); 
return new Date(+parts[2], +parts[1] - 1, +parts[0]); 
  }
  catch (e) {
     console.log ('Λάθος στην μετατροπή Ημερομηνίας για τον πελάτη: ' + valid);
return null ; 
  }
}



public static dumpResults(src : string[]) { 
    src.forEach ((element) => console.log(element)) ; 
}
}





