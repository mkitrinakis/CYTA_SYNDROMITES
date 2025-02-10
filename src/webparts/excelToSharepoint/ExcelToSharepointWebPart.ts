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
    this.domElement.innerHTML = `
    <div class="${ styles.excelToSharepoint }">Hello from Outer Space4...
    <br/> 
  <div>
  <input type="file" id="documentSets_fileInput">
<hr/> 
<div>
   <button id='btnCreate'> Test Button Create v0.19 </button>
</div>
  <div class="${ styles.excelToSharepoint }" id="csvCheck" style="display:block">results of csv...</div>
  </div>
  <hr/><br/><hr/><br/>
  
  In the following section upload the files to be sent automatically to sharepoint 
  <input type="file" id="pdfs_fileInput" multiple>
<hr/> 
<div>
   <button id='btnUpload'> Test Button Upload v0.21 </button>
</div>
 <div class="${ styles.excelToSharepoint }" id="pdfCheck" style="display:block">results of pdf Upload...</div>
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
      CsvUtils.processCsv (file, csvCheck, SharepointUtils.createDocumentSets); 
     
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
  

  private async  processPDFs_OLD(files : File[], pdfCheck:HTMLDivElement): Promise<void> {
  
    
    const clientContext = SP.ClientContext.get_current();
    const web = clientContext.get_web();
    let lib1: SP.List = web.get_lists().getByTitle('lib2'); 
    let rootFolder: SP.Folder = lib1.get_rootFolder(); 
    await clientContext.load(web); 
    await clientContext.load (lib1); 
    await clientContext.load (rootFolder, 'ServerRelativeUrl'); 
    await clientContext.executeQueryAsync();
    
    let basicPath : string = rootFolder.get_serverRelativeUrl(); 

      
    function uploadFileSequentially(index: number): void {
        if (index >= files.length) {
            console.log("Finished Uploading.");
            return;
        }
  
        const file = files[index];
        const reader = new FileReader();
  
        reader.onload = async function (event) {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const fileCreateInfo = new SP.FileCreationInformation();
            fileCreateInfo.set_content(new SP.Base64EncodedByteArray());
            clientContext.load(web, 'ServerRelativeUrl'); 
            

            
            // Convert ArrayBuffer to Base64 and set content
            const byteArray = new Uint8Array(arrayBuffer);
            for (let i = 0; i < byteArray.length; i++) {
                fileCreateInfo.get_content().append(byteArray[i]);
            }
  
            fileCreateInfo.set_url(file.name);
            //fileCreateInfo.set_url('https://intrrusttest.sharepoint.com/sites/Markos1/lib1/1311/1311.xlsx');
            
            fileCreateInfo.set_overwrite(true);
  
            // Upload file to SharePoint document library
            //const uploadFile = list.get_rootFolder().get_files().add(fileCreateInfo);
            let  subFolderUrl : string = file.name.split('.')[0] ;
            subFolderUrl = basicPath + "/" + subFolderUrl ; 
            //subFolderUrl = basicPath; 
     // console.log (subFolderUrl) ; 
            //list.get_rootFolder().get_folders().getByUrl (subFolderUrl); 
            let subFolder: SP.Folder  = web.getFolderByServerRelativeUrl (subFolderUrl) ;
            //let subFolder: SP.Folder = web.get_folders().gfet(subFolderUrl); 
            clientContext.load (subFolder); 
            
            await clientContext.executeQueryAsync(); 
          
            
            let uploadFile : SP.File  ; 
          
              
               uploadFile = subFolder.get_files().add(fileCreateInfo);
          
           
            try {
            clientContext.load(uploadFile );
            clientContext.executeQueryAsync(
                () => {
                  let msg : string = `File ${index + 1}/${files.length} : ${file.name} --> Φορτώθηκε Επιτυχώς: ${file.name}`; 
                    console.log(msg);
                    pdfCheck.innerHTML = pdfCheck.innerHTML + ` <br/>`  + msg ;   
                    uploadFileSequentially(index + 1); // Upload next file
                },
                (sender, args) => {
                  let msg : string = `Πρόβλημα στο αρχείο ${file.name}: ${args.get_message()}`; 
                    console.error(msg);
                    pdfCheck.innerHTML = pdfCheck.innerHTML + `<br/><font color='red'>` + msg + `</font>`; 
                }
            );
          }
          catch (e) { console.log ('cannot find folder:' + subFolderUrl)} ; 
        };
  
        reader.readAsArrayBuffer(file);
    }
    uploadFileSequentially(0);
    // Start uploading files sequentially
    // for (let i : number = 0; i< files.length ; i++ ) {
    // uploadFileSequentially(i);
    //}
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



  




