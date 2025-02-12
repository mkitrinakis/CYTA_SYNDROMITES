require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');

import {DocumentSetType} from './csvUtils'; 

export abstract class SharepointUtils {


// ΝΑ ΔΩ ΠΩΣ ΑΛΛΑΖΩ ΤΟ LIMIT ΤΩΝ 2MB? 
//https://stackoverflow.com/questions/45471855/sharepoint-online-uploading-files-larger-than-2mb-using-sharepointclient
public static checkFolderExists(folderNames: string[] )  {
  //  const siteUrl : string = 'https://intrrusttest.sharepoint.com/sites/Markos1'; 
 //   const clientContext: SP.ClientContext = new SP.ClientContext(siteUrl);
    let ctx : SP.ClientContext = SP.ClientContext.get_current();
    let documentLibrary: SP.List = ctx.get_web().getList('lib1'); 
    let folders: SP.FolderCollection  ; 
// Could also call getFileByServerRelativeUrl() here. Doesn't matter.
// The way this works is identical for files and folders.
// folderNames.forEach( (folderName) => {
// let folder: SP.Folder  = ctx.get_web().getFolderByServerRelativeUrl("/sites/Markos1/lib1/" + folderName );

// ctx.load(folder, "Name");
// }); 

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


public static async createDocumentSets(documentSets: DocumentSetType[], csvCheck:HTMLDivElement) {
console.log ('createDocumentSets v 1.1 starting...'); 
   let ctx : SP.ClientContext = SP.ClientContext.get_current();
   let documentLibrary: SP.List = ctx.get_web().get_lists().getByTitle('lib1')
   ctx.load(documentLibrary) ; 
   
   await ctx.executeQueryAsync();
   let rootFolder: SP.Folder = documentLibrary.get_rootFolder(); 
   ctx.load (rootFolder) ; 
   await ctx.executeQueryAsync(); 

   await   documentSets.forEach((el :DocumentSetType) => {
      console.log('start'); 
 let  newItemInfo: SP.ListItemCreationInformation  = new SP.ListItemCreationInformation();
            newItemInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
            newItemInfo.set_leafName(el.Title);
             let newListItem: SP.ListItem = documentLibrary.addItem(newItemInfo);
             newListItem.set_item('ContentTypeId', '0x0120D520');
            newListItem.set_item('Title', el.Title); 
            newListItem.set_item('DocumentSetDescription', el.Description); 
            newListItem.set_item('HTML_x0020_File_x0020_Type', 'SharePoint.DocumentSet'); 
            newListItem.update(); 
   ctx.load(newListItem); 
   ctx.executeQueryAsync(() => {
      console.log("Success"); 
      csvCheck.innerHTML = csvCheck.innerHTML + el.Title + ' SUCCESS <br/>' ; } , 
      (e) => {
         console.log("Error" + e + '-->' + el.Title);
         csvCheck.innerHTML = csvCheck.innerHTML + `<font color='red'>` +  el.Title + ` ERROR </font><br/>` ; 
       });
       console.log ('next'); 
   });
   

}

public static async createDocumentSet(folderName: string, description:string) {
   let ctx : SP.ClientContext = SP.ClientContext.get_current();
   //   const siteUrl : string = 'https://intrrusttest.sharepoint.com/sites/Markos1'; 
   // const ctx: SP.ClientContext = new SP.ClientContext(siteUrl);
   let documentLibrary: SP.List = ctx.get_web().get_lists().getByTitle('lib1')
  // ctx.load(documentLibrary, "RootFolder") ; 
  ctx.load(documentLibrary) ; 
  await ctx.executeQueryAsync(); 
  let list1: SP.List = ctx.get_web().get_lists().getByTitle('list1'); 
  // ctx.load(documentLibrary, "RootFolder") ; 
  ctx.load(list1) ; 
  await ctx.executeQueryAsync(); 
   let rootFolder: SP.Folder = documentLibrary.get_rootFolder(); 
   ctx.load (rootFolder) ; 
   await ctx.executeQueryAsync(); 
   let  newItemInfo: SP.ListItemCreationInformation  = new SP.ListItemCreationInformation();
            newItemInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
            newItemInfo.set_leafName(folderName);
            
    
             let newListItem: SP.ListItem = documentLibrary.addItem(newItemInfo);
             newListItem.set_item('ContentTypeId', '0x0120D520');
            newListItem.set_item('Title', folderName); 
            newListItem.set_item('DocumentSetDescription', description); 
            newListItem.set_item('HTML_x0020_File_x0020_Type', 'SharePoint.DocumentSet'); 
            newListItem.update(); 
   ctx.load(newListItem); 
   ctx.executeQueryAsync(() => {
      console.log("Success"); } , 
      (e) => {
         console.log("Error" + e);
       });
}




public static async  processPDFs(files : File[], pdfCheck:HTMLDivElement): Promise<void> {
  
    
   const clientContext = SP.ClientContext.get_current();
   const web = clientContext.get_web();
   let lib1: SP.List = web.get_lists().getByTitle('lib1'); 
   let rootFolder: SP.Folder = lib1.get_rootFolder(); 
   // await clientContext.load(web); 
   // await clientContext.load (lib1); 
   
   await clientContext.load (rootFolder, 'ServerRelativeUrl'); 
   let basicPath : string = '' ; 
    //clientContext.executeQueryAsync(() => { basicPath  = rootFolder.get_serverRelativeUrl(); console.log (`bp:` + basicPath);  uploadFileSequentially(0);}  );
   await clientContext.executeQueryAsync(); 
   basicPath  = rootFolder.get_serverRelativeUrl(); console.log (`bp:` + basicPath);  uploadFileSequentially(0);
   
     
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
           https://community.dynamics.com/blogs/post/?postid=f14b2517-2c9d-404a-8a37-e76846069f74
           FileCreationInformation.Content=new MemoryStream(Convert.FromBase64String(fileData));
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
  
   // Start uploading files sequentially
   // for (let i : number = 0; i< files.length ; i++ ) {
   // uploadFileSequentially(i);
   //}
 }
 


//  public  UploadFileSlicePerSlice(ctx : SP.ClientContext,  docs : SP.List,  file : File, fileName : string , fileChunkSizeInMB : number = 3) : File
//  {
//      // Each sliced upload requires a unique ID.
//      //Guid uploadId = Guid.NewGuid();

//      // Get the name of the file.
//      // Get the folder to upload into. 
    
    
//      // File object.
//       let uploadFile : File;

//      // Calculate block size in bytes.
//      let blockSize : number  = fileChunkSizeInMB * 1024 * 1024;

//      // Get the information about the folder that will hold the file.
    


//      // Get the size of the file.
//       let fileSize : number =  file.bytes.length;

//      if (fileSize <= blockSize)
//      {
//          // Use regular approach.
//          using (FileStream fs = new FileStream(fileName, FileMode.Open))
//          {
//              FileCreationInformation fileInfo = new FileCreationInformation();
//              fileInfo.ContentStream = fs;
//              fileInfo.Url = uniqueFileName;
//              fileInfo.Overwrite = true;
//              uploadFile = docs.RootFolder.Files.Add(fileInfo);
//              ctx.Load(uploadFile);
//              ctx.ExecuteQuery();
//              // Return the file object for the uploaded file.
//              return uploadFile;
//          }
//      }
//      else
//      {
//          // Use large file upload approach.
//          ClientResult<long> bytesUploaded = null;

//          FileStream fs = null;
//          try
//          {
//              fs = System.IO.File.Open(fileName, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
//              using (BinaryReader br = new BinaryReader(fs))
//              {
//                  byte[] buffer = new byte[blockSize];
//                  Byte[] lastBuffer = null;
//                  long fileoffset = 0;
//                  long totalBytesRead = 0;
//                  int bytesRead;
//                  bool first = true;
//                  bool last = false;

//                  // Read data from file system in blocks. 
//                  while ((bytesRead = br.Read(buffer, 0, buffer.Length)) > 0)
//                  {
//                      totalBytesRead = totalBytesRead + bytesRead;

//                      // You've reached the end of the file.
//                      if (totalBytesRead == fileSize)
//                      {
//                          last = true;
//                          // Copy to a new buffer that has the correct size.
//                          lastBuffer = new byte[bytesRead];
//                          Array.Copy(buffer, 0, lastBuffer, 0, bytesRead);
//                      }

//                      if (first)
//                      {
//                          using (MemoryStream contentStream = new MemoryStream())
//                          {
//                              // Add an empty file.
//                              FileCreationInformation fileInfo = new FileCreationInformation();
//                              fileInfo.ContentStream = contentStream;
//                              fileInfo.Url = uniqueFileName;
//                              fileInfo.Overwrite = true;
//                              uploadFile = docs.RootFolder.Files.Add(fileInfo);

//                              // Start upload by uploading the first slice. 
//                              using (MemoryStream s = new MemoryStream(buffer))
//                              {
//                                  // Call the start upload method on the first slice.
//                                  bytesUploaded = uploadFile.StartUpload(uploadId, s);
//                                  ctx.ExecuteQuery();
//                                  // fileoffset is the pointer where the next slice will be added.
//                                  fileoffset = bytesUploaded.Value;
//                              }

//                              // You can only start the upload once.
//                              first = false;
//                          }
//                      }
//                      else
//                      {
//                          // Get a reference to your file.
//                          uploadFile = ctx.Web.GetFileByServerRelativeUrl(docs.RootFolder.ServerRelativeUrl + System.IO.Path.AltDirectorySeparatorChar + uniqueFileName);

//                          if (last)
//                          {
//                              // Is this the last slice of data?
//                              using (MemoryStream s = new MemoryStream(lastBuffer))
//                              {
//                                  // End sliced upload by calling FinishUpload.
//                                  uploadFile = uploadFile.FinishUpload(uploadId, fileoffset, s);
//                                  ctx.ExecuteQuery();

//                                  // Return the file object for the uploaded file.
//                                  return uploadFile;
//                              }
//                          }
//                          else
//                          {
//                              using (MemoryStream s = new MemoryStream(buffer))
//                              {
//                                  // Continue sliced upload.
//                                  bytesUploaded = uploadFile.ContinueUpload(uploadId, fileoffset, s);
//                                  ctx.ExecuteQuery();
//                                  // Update fileoffset for the next slice.
//                                  fileoffset = bytesUploaded.Value;
//                              }
//                          }
//                      }

//                  } // while ((bytesRead = br.Read(buffer, 0, buffer.Length)) > 0)
//              }
//          }
//          finally
//          {
//              if (fs != null)
//              {
//                  fs.Dispose();
//              }
//          }
//      }

//      return null;
//  }



public static async createDocumentSet_Old(folderName: string) {
   //let ctx : SP.ClientContext = SP.ClientContext.get_current();
      const siteUrl : string = 'https://intrrusttest.sharepoint.com/sites/Markos1'; 
    const ctx: SP.ClientContext = new SP.ClientContext(siteUrl);
   let documentLibrary: SP.List = ctx.get_web().get_lists().getByTitle('lib1')
  // ctx.load(documentLibrary, "RootFolder") ; 
  ctx.load(documentLibrary) ; 
  await ctx.executeQueryAsync(); 
  //let list1: SP.List = ctx.get_web().get_lists().getByTitle('list1'); 
  // ctx.load(documentLibrary, "RootFolder") ; 
  //ctx.load(list1) ; 
  //await ctx.executeQueryAsync(); 
   let rootFolder: SP.Folder = documentLibrary.get_rootFolder(); 
   ctx.load (rootFolder) ; 
   await ctx.executeQueryAsync(); 
   let contentTypeID : string = "0x0120D52000683659260B26AF42AF65E57B09B613C2005AE31D539D0FB244BAEE6EA8CB1F4D52";

   contentTypeID = '0x0120D520007027D4D086859849A1A7A2D86118F15E'; 
   contentTypeID = '0x0120D520' ; 
  let contentType: SP.ContentType =  documentLibrary.get_contentTypes().getById(contentTypeID); 
  ctx.load (contentType) ; 

 SP.DocumentSet.DocumentSet.create (ctx, rootFolder, folderName, contentType.get_id() )

//    let  newItemInfo: SP.ListItemCreationInformation  = new SP.ListItemCreationInformation();
//             newItemInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
//             newItemInfo.set_leafName(folderName);
//              let newListItem: SP.ListItem = documentLibrary.addItem(newItemInfo);
//             newListItem.set_item('Title', folderName); 
//             newListItem.update(); 
//    ctx.load(newListItem); 
   ctx.executeQueryAsync(() => {
      console.log("Success"); } , 
      (e) => {
         console.log("Error" + e);
       });
}


    protected createListItem() {
        // You can optionally specify the Site URL here to get the context
        // If you don't specify the URL, the method will get the context of the current site
        // var clientContext = new SP.ClientContext("http://MyServer/sites/SiteCollection");
        try {
          const siteUrl : string = 'https://intrrusttest.sharepoint.com/sites/Markos1'; 
          const clientContext: SP.ClientContext = new SP.ClientContext(siteUrl);
     
        var oWeb = clientContext.get_web();
     
        // Specify list title here
        var oList = oWeb.get_lists().getByTitle("list1");
     
        // Get Item using CAML Query
        //var camlQuery = new SP.CamlQuery();
     
        // New "ListItemCreationInformation" Object
        var oListItemCreationInformation = new SP.ListItemCreationInformation();
     
        var oListItem = oList.addItem(oListItemCreationInformation);
     
        // Set value for each column here
        oListItem.set_item('Title', 'New item value');
     //   oListItem.set_item('Notes', 'This is dummy data');
     
        oListItem.update();
     
        clientContext.load(oListItem);
     
        // Execute the query to the server.
        clientContext.executeQueryAsync(() => {console.log("Success"); } , (e) => {console.log("Error" + e); });
        }
        catch (e) { console.log (e); alert (e); }
    }

} 