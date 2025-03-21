import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IWebPartPropertiesMetadata } from '@microsoft/sp-webpart-base';


import styles from './ExcelToSharepointWebPart.module.scss';
import {CsvUtils} from './csvUtils'; 
//import {DocumentSetType} from './csvUtils'; 
import {SharepointUtils} from './sharepointUtils'; 
import {Parameters} from './parameters'; 

import {
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneLabel,
  PropertyPaneLink,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  IPropertyPaneConfiguration,
  IPropertyPaneDropdownProps
} from '@microsoft/sp-property-pane';

import * as fs from 'fs'; 




export interface IExcelToSharepointWebPartProps {
//   baseUrl : string; 
//   libraryName : string; 
}

export default class ExcelToSharepointWebPart extends BaseClientSideWebPart<IExcelToSharepointWebPartProps> {
  
  // protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  //   return {
  //     pages: [
  //       {
  //         header: {
  //           description: Strings.PropertyPaneDescription
  //         },
  //         groups: [
  //           {
  //             groupName: Strings.BasicGroupName,
  //             groupFields: [
  //             PropertyPaneTextField('baseUrl', {
  //               label: 'baseUrl'
  //             }),
  //             PropertyPaneTextField('libraryName', {
  //               label: 'libraryName'
  //             }),
  //           ]
  //           }
  //         ]
  //       }
  //     ]
  //   };
  // }
  

//

private libraryName : string =  Parameters.getLibraryName(); 



  public render(): void {
let errorHandling = '' ; 
try {
  errorHandling = 'while rendering' ; 
    this.domElement.innerHTML = `
<div class="${ styles.cytaSyndromites }">Παρακαλώ επιλέξτε το csv με τις πληροφορίες για τα Binders που θα δημιουργηθούν
    <br/> 
    <input type="file" id="documentSets_fileInput">
    <hr/> 
<br/> 

 Και στη συνέχεια επιλέξτε το παρακάτω button για τη δημιουργία των Binders:  
   <button id='btnCreate'> Δημιουργία Binders </button>

  

<br/> 
  <div class="${ styles.cytaSyndromites } ${ styles.cytaSyndromitesResults }" id="csvCheck">Αποτελέσματα της διαδικασίας δημιουργίας Binders...</div>
  
  
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
    errorHandling = 'while setting buttonEventHandler' ; 
    this.setButtonEventHandlers(); 
}
catch (e : unknown) { 
    let msg : string  = 'N/A'; 
    if (typeof e === "string") {
      msg = e.toUpperCase() // works, `e` narrowed to string
  } else if (e instanceof Error) {
      msg = e.message // works, `e` narrowed to Error
  }
  msg = 'System error:' + msg ; 
console.log (msg); 
alert (msg) ; 

  }
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
    
    let files : FileList | null = (document.getElementById('documentSets_fileInput') as HTMLInputElement)?.files ; 
    let csvCheck: HTMLDivElement  = (document.getElementById('csvCheck') as HTMLDivElement); 
    csvCheck.innerHTML = 'Εκκινηση της διαδικασία δημιουργίας Document Sets από το csv ...' ; 
   if (files) {
    const file = files[0]; 
    if (file) {
      csvCheck.innerHTML = 'Εκκινηση της διαδικασία δημιουργίας Document Sets από το csv ... Βρεθήκαν αρχεία για Εισαγωγή<br/>' ; 
      CsvUtils.processCsv (file, csvCheck, this.libraryName, SharepointUtils.createDocumentSets); 
     
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
    SharepointUtils.processPDFs(files, pdfCheck, this.libraryName); 
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



  




