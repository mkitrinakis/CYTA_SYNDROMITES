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
   <button id='btnUpload'> Test Button Upload v0.16 </button>
</div>
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
    csvCheck.innerHTML = 'START2!' ; 
   if (files) {
    const file = files[0]; 
    if (file) {
      csvCheck.innerHTML = 'Starting process....<br/>' ; 
      CsvUtils.processCsv (file, csvCheck, SharepointUtils.createDocumentSets); 
     
      //SharepointUtils.createDocumentSets (rs) ; 
      }
      else {
       const csvData: any[] = [];
       console.log(csvData); 
      }
   }    
  }

    
   
  

  private async  uploadPDFs(): Promise<void> {
    const fileInput = document.getElementById('pdfs_fileInput') as HTMLInputElement;
    
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        console.error("No files selected.");
        return;
    }
  
    const files = Array.from(fileInput.files);
    const clientContext = SP.ClientContext.get_current();
    const web = clientContext.get_web();
    let lib1: SP.List = web.get_lists().getByTitle('lib2'); 
    let rootFolder: SP.Folder = lib1.get_rootFolder(); 
    clientContext.load(web, 'ServerRelativeUrl'); 
    clientContext.load (lib1); 
    clientContext.load (rootFolder); 
    
    await clientContext.executeQueryAsync();
    console.log (rootFolder.get_serverRelativeUrl())
    console.log (web.get_serverRelativeUrl()); 
    let basicPath : string = rootFolder.get_serverRelativeUrl(); 

      
    function uploadFileSequentially(index: number): void {
        if (index >= files.length) {
            console.log("All files uploaded successfully.");
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
      console.log (subFolderUrl) ; 
            //list.get_rootFolder().get_folders().getByUrl (subFolderUrl); 
            let subFolder: SP.Folder  = web.getFolderByServerRelativeUrl (subFolderUrl) ;
            //let subFolder: SP.Folder = web.get_folders().gfet(subFolderUrl); 
            clientContext.load (subFolder); 
            
            await clientContext.executeQueryAsync(); 
            var rsp = confirm('the new way?') ; 
            
            let uploadFile : SP.File  ; 
            if (rsp) {
              console.log ('the new way'); 
               uploadFile = subFolder.get_files().add(fileCreateInfo);
            }
            else {
              console.log ('the old way'); 
            uploadFile = web.get_folders().getByUrl(subFolderUrl).get_files().add(fileCreateInfo);
            }
            try {
            clientContext.load(uploadFile );
            clientContext.executeQueryAsync(
                () => {
                    console.log(`File ${index + 1}/${files.length} uploaded successfully: ${file.name}`);
                    uploadFileSequentially(index + 1); // Upload next file
                },
                (sender, args) => {
                    console.error(`Error uploading file ${file.name}: ${args.get_message()}`);
                }
            );
          }
          catch (e) { console.log ('cannot find folder:' + subFolderUrl)} ; 
        };
  
        reader.readAsArrayBuffer(file);
    }
  
    // Start uploading files sequentially
    uploadFileSequentially(0);
    uploadFileSequentially(1);
    uploadFileSequentially(2);
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



  }




