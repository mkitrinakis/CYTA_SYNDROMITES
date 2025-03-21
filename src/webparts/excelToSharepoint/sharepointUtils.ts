require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');

import {DocumentSetType} from './csvUtils'; 
import {Parameters} from './parameters'; 
import * as fs from 'fs'; 




//Sites/PowerApps-Devs/Tests 
export abstract class SharepointUtils {
   

// ΝΑ ΔΩ ΠΩΣ ΑΛΛΑΖΩ ΤΟ LIMIT ΤΩΝ 2MB? 
//https://stackoverflow.com/questions/45471855/sharepoint-online-uploading-files-larger-than-2mb-using-sharepointclient
//https://community.dynamics.com/blogs/post/?postid=f14b2517-2c9d-404a-8a37-e76846069f74


private static libraryPath : string =  Parameters.getLibraryUrl(); 


public static async createDocumentSets(documentSets: DocumentSetType[], csvCheck:HTMLDivElement, libraryName : string) {
console.log ('createDocumentSets v 10.0 starting...'); 

   let ctx : SP.ClientContext = SP.ClientContext.get_current();
   let documentLibrary: SP.List = ctx.get_web().get_lists().getByTitle(libraryName); 
   ctx.load(documentLibrary) ; 
   await ctx.executeQueryAsync();
let counter : number = 0; 
   await   documentSets.forEach((el :DocumentSetType) => {
      counter ++; 
    //  console.log('start'); 
 let  newItemInfo: SP.ListItemCreationInformation  = new SP.ListItemCreationInformation();
            newItemInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
            newItemInfo.set_leafName(el.Title);
             let newListItem: SP.ListItem = documentLibrary.addItem(newItemInfo);
             newListItem.set_item('ContentTypeId', '0x0120D520');

          //   newListItem.set_item('ContentTypeId', '0x0120D520006525B4AA47A921449105A9DE7F02C441');  // Φακελοσ Πελάτη
             // Δεν παίζει κανένα extra πεδίο, Ελληνικά 
             // // Δεν παίζει κανένα extra πεδίο,  Αγγλικά. 
             //newListItem.set_item('ContentTypeId', '0x0120D520006525B4AA47A921449105A9DE7F02C441000E4C7525565E314A9EBA3D655E3208B2'); // Φακελος Πελάτη List CT     
            newListItem.set_item('Title', el.Title); 
            //newListItem.set_item('_x0394__x03b9__x03ba__x03b7__x03b3__x03cc__x03c1__x03bf__x03c2_', el.Lawyer); 
            newListItem.set_item('Lawyer', el.Lawyer); 
            if (el.DateSend != null) {
               //newListItem.set_item('_x0397__x03bc__x03b5__x03c1__x002e__x0020__x0391__x03c0__x03bf__x03c3__x03c4__x03bf__x03bb__x03ae__x03c2_', el.DateSent); 
               newListItem.set_item('DateSend', el.DateSend); 
            }
            
            //newListItem.set_item('_x0391__x0394__x03a4__x002f__x0391__x03c1__x002e__x0020__x0395__x03b3__x03b3__x03c1__x03b1__x03c6__x03ae__x03c2_', el.CustomerID1); 
            newListItem.set_item('CustomerID1', el.CustomerID1); 
            //newListItem.set_item('_x039a__x03b1__x03c4__x03ac__x03c3__x03c4__x03b1__x03c3__x03b7__x0020__x03a6__x03b1__x03ba__x03ad__x03bb__x03bf__x03c5_', el.StatusDocSet);
            newListItem.set_item('StatusDocSet', el.StatusDocSet);
            //newListItem.set_item('CustomerName1', el.CustomerName); 
            newListItem.set_item('CustomerName', el.CustomerName); 
         
            newListItem.update(); 
   ctx.load(newListItem); 
   
   ctx.executeQueryAsync(() => {
      console.log("Success"); 
      csvCheck.innerHTML = csvCheck.innerHTML + el.Title + ' ΕΠΙΤΧΗΣ ΚΑΤΑΧΩΡΗΣΗ <br/>' ; } , 
      (e, args) => {
         console.log("Error" +  '-->' + args.get_message() +  '-->' +  el.Title);
         csvCheck.innerHTML = csvCheck.innerHTML + `<font color='#ff9999'>` +  el.Title + ` ΠΡΟΒΛΗΜΑ ΣΤΗ ΔΗΜΙΟΥΡΓΙΑ,  ΘΑ ΕΛΕΓΧΘΕΙ ΕΦΟΣΟΝ ΥΠΑΡΧΕΙ ΗΔΗ Ο ΦΑΚΕΛΟΣ ΝΑ ΓΙΝΕΙ UPDATE  </font><br/>` ; 
         SharepointUtils.UpdateDocumentSet(el, csvCheck, libraryName)
         
       });
//       console.log ('next'); 
   });
   
}

private static async UpdateDocumentSet(toUpdate: DocumentSetType, csvCheck:HTMLDivElement, libraryName : string) {
   console.log ('UpdateDocumentSets v 1.0.8 starting...'); 
      let ctx : SP.ClientContext = SP.ClientContext.get_current();
      let web : SP.Web  = ctx.get_web(); 
      ctx.load (web); 
      await ctx.executeQueryAsync(); 
      let documentLibrary: SP.List = web.get_lists().getByTitle(libraryName); 
      ctx.load(documentLibrary) ; 
      await ctx.executeQueryAsync(); 
   //    let rootFolder : SP.Folder = documentLibrary.get_rootFolder(); 
   //    ctx.load (rootFolder); 
   // await ctx.executeQueryAsync(); 
   //let basicPath : string = '' ; 
   //basicPath  = rootFolder.get_serverRelativeUrl(); 
   
         let subFolderUrl : string  = this.libraryPath + "/" + toUpdate.Title ; 
         console.log ('subfolderUrl:' + subFolderUrl); 
         let subFolder: SP.Folder  = web.getFolderByServerRelativeUrl (subFolderUrl) ;
         let ds : SP.DocumentSet.DocumentSet ; 
         //let subFolder: SP.Folder = web.get_folders().gfet(subFolderUrl); 
         ctx.load (subFolder);    
         //subFolder.get_listItemAllFields().set_item('_x0394__x03b9__x03ba__x03b7__x03b3__x03cc__x03c1__x03bf__x03c2_', toUpdate.Lawyer); 
         subFolder.get_listItemAllFields().set_item('Lawyer', toUpdate.Lawyer); 
         if (toUpdate.DateSend != null) {
            //subFolder.get_listItemAllFields().set_item('_x0397__x03bc__x03b5__x03c1__x002e__x0020__x0391__x03c0__x03bf__x03c3__x03c4__x03bf__x03bb__x03ae__x03c2_', toUpdate.DateSent); 
            subFolder.get_listItemAllFields().set_item('DateSend', toUpdate.DateSend); 
         }
//            subFolder.get_listItemAllFields().set_item('_x0391__x0394__x03a4__x002f__x0391__x03c1__x002e__x0020__x0395__x03b3__x03b3__x03c1__x03b1__x03c6__x03ae__x03c2_', toUpdate.CustomerID1); 
         subFolder.get_listItemAllFields().set_item('CustomerID1', toUpdate.CustomerID1); 
            //subFolder.get_listItemAllFields().set_item('_x039a__x03b1__x03c4__x03ac__x03c3__x03c4__x03b1__x03c3__x03b7__x0020__x03a6__x03b1__x03ba__x03ad__x03bb__x03bf__x03c5_', toUpdate.StatusDocSet);
            subFolder.get_listItemAllFields().set_item('StatusDocSet', toUpdate.StatusDocSet);
            //subFolder.get_listItemAllFields().set_item('CustomerName1', toUpdate.CustomerName); 
            subFolder.get_listItemAllFields().set_item('CustomerName', toUpdate.CustomerName); 
         
         subFolder.get_listItemAllFields().update(); 
      ctx.executeQueryAsync(() => {
         console.log("Success"); 
         csvCheck.innerHTML = csvCheck.innerHTML + toUpdate.Title + ' ΕΠΙΤΥΧΗΣ ΕΝΗΜΕΡΩΣΗ <br/>' ; } , 
         (e, args) => {
            console.log("Error" + args.get_errorDetails() + '-->' + toUpdate.Title);
            csvCheck.innerHTML = csvCheck.innerHTML + `<font color='#ff9999'>` +  toUpdate.Title + ` ΠΡΟΒΛΗΜΑ ΣΤΗΝ ΕΝΗΜΕΡΩΣΗ </font><br/>` ; 
           
          });
          console.log ('next'); 
      ;

}








public static async  processPDFs(files : File[], pdfCheck:HTMLDivElement, libraryName: string): Promise<void> {
  
    
   const clientContext = SP.ClientContext.get_current();
   const web = clientContext.get_web();
   clientContext.load(web) ; 
   await clientContext.executeQueryAsync(); 
   let library: SP.List = web.get_lists().getByTitle(libraryName); 
   clientContext.load(library); 
   await clientContext.executeQueryAsync(); 
  //let library: SP.List = web.getList()
   let rootFolder: SP.Folder = library.get_rootFolder(); 
   // await clientContext.load(web); 
   // await clientContext.load (lib1); 
   
    //clientContext.load (rootFolder, 'ServerRelativeUrl'); 
    clientContext.load (rootFolder); 
   
    //clientContext.executeQueryAsync(() => { basicPath  = rootFolder.get_serverRelativeUrl(); console.log (`bp:` + basicPath);  uploadFileSequentially(0);}  );
   await clientContext.executeQueryAsync(); 
   
   

    uploadFileSequentially(0);
       let libraryPath = Parameters.getLibraryUrl(); 
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
           fileCreateInfo.set_overwrite(true);
 
           // Upload file to SharePoint document library
           //const uploadFile = list.get_rootFolder().get_files().add(fileCreateInfo);
           let  subFolderUrl : string = file.name.split('_')[0] ; // format must be XXXXXX_CC.pdf 
           subFolderUrl = libraryPath + "/" + subFolderUrl ; 
           console.log ('sunFolderUrl:' + subFolderUrl); 
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
                   uploadFileSequentially(index + 1); // Upload next file
               }
           );
         }
         catch (e) { console.log ('cannot find folder:' + subFolderUrl)} ; 
       };
 
       reader.readAsArrayBuffer(file);
   }
  
   // Start uploading files sequentially
   // for (let i : number = 0; i< files.length ; i++ ) {
   // uploadFileSequentially(i);
   //}
 }
 

// NOT USED 
private  static checkFolderExists(folderNames: string[] )  {
   let ctx : SP.ClientContext = SP.ClientContext.get_current();
   let documentLibrary: SP.List = ctx.get_web().getList('xxxxxx'); 
   let folders: SP.FolderCollection  ; 


ctx.load(documentLibrary) ; 
let rootFolder: SP.Folder = documentLibrary.get_rootFolder(); 

ctx.load (rootFolder) ; 
folders  = rootFolder.get_folders(); 
ctx.load(folders);
ctx.executeQueryAsync(
  function() {
  console.log ('ok')},
  function(s, args) {
     if (args.get_errorTypeName() === "System.IO.FileNotFoundException") {
        // Folder doesn't exist at all.
        console.log("Folder does not exist.");
     }
     else {
        // An unexpected error occurred.
        console.log("Error: " + args.get_message());
     }
  }
);
} 




} 