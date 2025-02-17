

//import * as fs from 'fs'; 
//import { forEach } from 'lodash';


export  type DocumentSetType = {
  Title: string;
  Description: string; 
  
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
console.log(columns[0]); 
console.log(columns[2]); 
let entry: DocumentSetType = { Title:columns[0], Description:columns[1] }; 
result.push(entry);
     }
     callback(result, csvCheck, libraryName) ; 
     rs += '<table>' ; 
   //  finished = true; 
      
  };

 fileReader.readAsText(file, 'utf-8' );
}


public static dumpResults(src : string[]) { 
    src.forEach ((element) => console.log(element)) ; 
}
}





