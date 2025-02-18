import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';


import styles from './ExcelToSharepointWebPart.module.scss';
import {CsvUtils} from './csvUtils'; 
//import {DocumentSetType} from './csvUtils'; 
import {SharepointUtils} from './sharepointUtils'; 



import * as fs from 'fs'; 




export interface IExcelToSharepointWebPartProps {
}

export default class ExcelToSharepointWebPart extends BaseClientSideWebPart<IExcelToSharepointWebPartProps> {
  public render(): void {
let old: string = `
<div class="${ styles.cytaSyndromites }">Hello from Outer Space4...
    <br/> 
    <input type="file" id="documentSets_fileInput">
  </div>
  
<hr/> 
<br/> 
<div>
   <button id='btnCreate'> Test Button Create v0.22 </button>
</div>
<br/> 
  <div class="${ styles.cytaSyndromites }" id="csvCheck" style="display:block">results of csv...</div>
  
  <hr/><br/><hr/><br/>

<div>  
  In the following section upload the files to be sent automatically to sharepoint 
<br/> 
  <input type="file" id="pdfs_fileInput" multiple>
<hr/> 
</div> 
<div>
   <button id='btnUpload'> Test Button Upload v0.29 </button>
</div>
 <div class="${ styles.cytaSyndromites }" id="pdfCheck">results of pdf Upload...</div>
`


    this.domElement.innerHTML = `
<div class="${ styles.cytaSyndromites }">Παρακαλώ επιλέξτε το csv με τις πληροφορίες για τα Binders που θα δημιουργηθούν
    <br/> 
    <input type="file" id="documentSets_fileInput">
    <hr/> 
<br/> 

 Και στη συνέχεια επιλέξτε το παρακάτω button για τη δημιουργία των Binders:  
   <button id='btnCreate'> Δημιουργία Binders </button>

  

<br/> 
  <div class="${ styles.cytaSyndromites } "${ styles.cytaSyndromitesResults }" id="csvCheck">Αποτελέσματα της διαδικασίας δημιουργίας Binders...</div>
  
  <hr/><br/><hr/><br/>

<div class="${ styles.cytaSyndromites }">  
  Παρακάτω επιλέξτε το σύνολο των pdf που θέλετε να ανέβουν αυτοματοποιημένα στα ανάλογα folders. <span class="${styles.cytaSyndromitesAlert}">ΠΡΟΣΟΧΗ</span> δεν πρέπει να είναι μεγαλύτερα των 2MB
<br/> 
  <input type="file" id="pdfs_fileInput" multiple>
<hr/> 
<br/> 
Και στη συνέχεια επιλέξτε το παρακάτω button για το μαζικό upload: <button id='btnUpload'> Μαζικό Upolad pdf </button>
</div> 

<br/> 
 <div class="${ styles.cytaSyndromites} ${styles.cytaSyndromitesResults}" id="pdfCheck" style="display:block">Αποτελέσματα της διαδικασίας μαζικού upload pdf...</div>

 <hr/> 


  `;



    //SharepointUtils.createListItem(); 
    this.setButtonEventHandlers(); 
  }



  private setButtonEventHandlers(): void {  
    // const webPart: WpConfigureApplicationCustomizerWebPart = this;  
    let btn : any; 
       let btnCreate : any = document.getElementById('btnCreate'); 
    if (btnCreate != null) {
      btnCreate.addEventListener('click', this.createDocumentSets.bind(this)); 
    }

    let btnUpload : any = document.getElementById('btnUpload'); 
    if (btnUpload != null) {
      btnUpload.addEventListener('click', this.uploadPDFs.bind(this)); 
    }
 }; 


  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }


//   private testCreate() :void {
// console.log ('starting...');
// SharepointUtils.createDocumentSet_Old('docSet4'); 
// //SharepointUtils.createDocumentSet('docSet1'); 
// console.log ('... after call');
//   }


  private createDocumentSets(): void {
    console.log('Hi test v0.5.') ; 
    
    let files : FileList | null = (document.getElementById('documentSets_fileInput') as HTMLInputElement)?.files ; 
    let csvCheck: HTMLDivElement  = (document.getElementById('csvCheck') as HTMLDivElement); 
    csvCheck.innerHTML = 'Εκκινηση της διαδικασία δημιουργίας Document Sets από το csv ...' ; 
   if (files) {
    const file = files[0]; 
    if (file) {
      csvCheck.innerHTML = 'Εκκινηση της διαδικασία δημιουργίας Document Sets από το csv ... Βρεθήκαν αρχεία για Εισαγωγή<br/>' ; 
      CsvUtils.processCsv (file, csvCheck, 'lib1', SharepointUtils.createDocumentSets); 
     
      //SharepointUtils.createDocumentSets (rs) ; 
      }
      else {
        alert ('δεν επιλέχθηκε csv αρχείο'); 
      }
   }    
  }

    
  private async  uploadPDFs() : Promise<void> {
    const fileInput = document.getElementById('pdfs_fileInput') as HTMLInputElement;
    let pdfCheck: HTMLDivElement  = (document.getElementById('pdfCheck') as HTMLDivElement); 
    pdfCheck.innerHTML = 'Εκκινηση της διαδικασίας Φόρτωσης PDF Αρχείων ...' ; 
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert("Δεν επιλέχθηκαν αρχεία.");
        return;
    }
    let files :File[] = Array.from(fileInput.files);
    SharepointUtils.processPDFs(files, pdfCheck); 
  }
  

 
  }





// NOT USED 
  // private processCSV(toCheck : boolean): void {
  //   console.log('Hi') ; 
  //  //  let files : FileList | null = (document.getElementById('Hello_fileInput') as HTMLInputElement)?.files ; 
  // //  if (files) {
  // //   const file = files[0]; 
  // //   if (file) {
  // //     let rs:string = CsvUtils.processCsv(file, true); 
  // //     let csvCheck : HTMLDivElement | null = document.getElementById('csvCheck') as HTMLDivElement; 
  // //     if (csvCheck) {
  // //      csvCheck.innerHTML = rs ; 
  // //      SharepointUtils.checkFolderExists (['1','2','3','4']); 
       
  // //     }
  // //     }
  // //     else {
  // //      const csvData: any[] = [];
  // //      console.log(csvData); 
  // //     }
  // //   }    
  //  }



  




