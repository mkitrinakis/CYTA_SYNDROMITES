require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');

import {DocumentSetType} from './csvUtils'; 

export abstract class SharepointUtils {



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


public static async createDocumentSets(documentSets: DocumentSetType[]) {
console.log ('createDocumentSets starting...'); 
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
      console.log("Success"); } , 
      (e) => {
         console.log("Error" + e + '-->' + el.Title);
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