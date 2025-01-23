import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';


import styles from './ExcelToSharepointWebPart.module.scss';
import {CsvUtils} from './csvUtils'; 
//import {DocumentSetType} from './csvUtils'; 
import {SharepointUtils} from './sharepointUtils'; 





export interface IExcelToSharepointWebPartProps {
}

export default class ExcelToSharepointWebPart extends BaseClientSideWebPart<IExcelToSharepointWebPartProps> {
  public render(): void {
    this.domElement.innerHTML = `
    <div class="${ styles.excelToSharepoint }">Hello from Outer Space4...
    <br/> 
    <button id='testButton5'> Test Button 5.12 </button>
    </div>
  <div>
  <input type="file" id="Hello_fileInput">
<hr/> 
<div>
   <button id='testButtonCreate'> Test Button Create v0.10 </button>
</div>
  <div class="${ styles.excelToSharepoint }" id="csvCheck">results of csv...</div>
  </div>`;
    //SharepointUtils.createListItem(); 
    this.setButtonEventHandlers(); 
  }



  private setButtonEventHandlers(): void {  
    // const webPart: WpConfigureApplicationCustomizerWebPart = this;  
    let btn : any; 
    btn = document.getElementById('testButton5'); 
    if (btn != null) {
     btn.addEventListener('click', this.processCSV.bind(this)); 
    }
    let btnCreate : any = document.getElementById('testButtonCreate'); 
    if (btnCreate != null) {
      btnCreate.addEventListener('click', this.test.bind(this)); 
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


  private test(): void {
    console.log('Hi test v0.5.') ; 
    let files : FileList | null = (document.getElementById('Hello_fileInput') as HTMLInputElement)?.files ; 
   if (files) {
    const file = files[0]; 
    if (file) {
       CsvUtils.processCsv(file, true, SharepointUtils.createDocumentSets); 
      //SharepointUtils.createDocumentSets (rs) ; 
      }
      else {
       const csvData: any[] = [];
       console.log(csvData); 
      }
    }    
  }

  private processCSV(toCheck : boolean): void {
    console.log('Hi') ; 
 
  //  let files : FileList | null = (document.getElementById('Hello_fileInput') as HTMLInputElement)?.files ; 
  //  if (files) {
  //   const file = files[0]; 
  //   if (file) {
  //     let rs:string = CsvUtils.processCsv(file, true); 
  //     let csvCheck : HTMLDivElement | null = document.getElementById('csvCheck') as HTMLDivElement; 
  //     if (csvCheck) {
  //      csvCheck.innerHTML = rs ; 
  //      SharepointUtils.checkFolderExists (['1','2','3','4']); 
       
  //     }
  //     }
  //     else {
  //      const csvData: any[] = [];
  //      console.log(csvData); 
  //     }
  //   }    
   }



  }




