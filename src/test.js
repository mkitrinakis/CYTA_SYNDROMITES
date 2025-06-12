<title>Settlement Tool</title>
  
 <script language="javascript" src="/commonApplications/Documents/jquery/jquery-1.12.4.js"></script> 
 <!--  <script language="javascript" src="/InfoportalUI/l_js/fulljquery/jquery-3.1.1.min.js"></script> --> 
 
 
 
  <link rel="stylesheet" href="/commonApplications/Documents/ui/themes/base/jquery-ui.css"> 
    <!-- SMS Tool -->  

  <link rel="stylesheet" href="/commonApplications/Documents/ui/themes/base/jquery-ui.min.css"> 
  <link rel="stylesheet" href="/CC/SMS_Tool/Documents/sms_tool.css"> 

     
<script language="javascript" type="text/javascript"> 
var spType = "SPServices"; //SPServices or native 
var appName = 'Delays/Arrangements_CC'; //this should reflect the team that uses the app. It is needed for the universal history list , ΠΡΕΠΕΙ ΝΑ ΟΡΙΣΤΕΙ ΕΝΑ 'ABACUS' 
var siteUrl = '/CC/SMS_Tool'; //Location of the lists 
var listTitle0 = 'BILL_ARRANGEMENT_SMS';    // Λίστα SMS Για Διακανονισμούς 
var listGUID0 = '{d9a06d58-a909-4f7b-aae8-9f1b7d033f62}'; 
var listTitle1 = 'SAM_Agents'; //List that contains the agents 
var listGUID1 = '{a463e0fb-ee9d-4be8-bc06-6887c77b00f7}'; 
var listTitle2 = 'SAM_SMS'; //List that contains the sms types/texts 
var listGUID2 = '{96ecfec9-a6a3-4819-aedd-5d53df3de49f}'; 
var listTitle3 = 'Universal_history_Abacus2'; //List for logging messages in new abacus 
var listGUID3 = '{96ba8f1f-b457-47a0-b72b-04484ba409de}';  
var SMSSender = 'Vodafone'; //The sender. Can be Vodafone or 13830 ONLY! 
var a13342 = 'roaming'; 
var b13342 = 'r0am1ng'; 
var isPersonalized = true; //Does the app send personalized SMS? true/false 
var isBulk = false; //Does the app send bulk SMS? true/false 
var isBulkCapable = false; //Can the agent use bulk functionality? true/false 
var isHistoryEnabled = true; //If true, it will display the history for the particular MSISDN 
var historyDays = 30; //how far back (in days) to look? 
var testmode = false; //no sms will be sent if true 
var allowBulkDuplicates = false; //allow duplicates when in bulk mode? true/false 
var animationDuration = 1000; 
var mydiv = ""; 
var programList1 = 'UpperList'; // Η λίστα με τα Treatments
var programList1GUID = '{d738f396-ba83-4002-83c8-676a7b415068}';

    
     
// Calendar variables 
     var dbDate = ""; 
     var date2 = new Date(dbDate); 
     var currentdate = new Date(); // Επιστρέφει την τωρινή ημερομηνία 
     var user_date1;  // η ημερομηνιά έκδοσης λογαριασμού 
     var user_date2;  // η επιθυμητή ημερομηνία πληρωμής 
     var dateObject1=""; 
     var dateObject2=""; 
     var cDate = new Date(); 
     var dates = []; 
     //var currentDate = cDate.getDate() + "/" + (cDate.getMonth()+1) + "/" + cDate.getFullYear(); 

//Calendar Variables End   
     
    // Φορτώνουμε τα script του SMS Tool 
        //jQuery(document).ready(function($) { 

         $.getScript("/commonApplications/Documents/jquery/jquery-1.12.4.js",function(){   //Add 
             //$.getScript("/commonApplications/Documents/jquery/jquery-1.12.4.min.js",function(){   //Add 
            $.getScript("/commonApplications/Documents/spservices/jquery.SPServices.min.js",function(){ 
                $.getScript("/commonApplications/Documents/ui/jquery-ui.js",function(){   //Add 
                      $("#cal_text").datepicker({  // Ημερομηνία εκδοσης λογαριασμού 

                                        maxDate: new Date(), // Η ημερομηνία έκδοσης είναι σε προγενέστερη ημερομηνία 
                                        firstDay: 1, 
                                        dateFormat: 'dd-mm-yy',
                                        showButtonPanel: true,
                                        closeText: 'Clear', // Text to show for "close" button
                                        onClose: function () {
                                            var event = arguments.callee.caller.caller.arguments[0];
                                            // If "Clear" gets clicked, then really clear it
                                            if (jQ112(event.delegateTarget).hasClass('ui-datepicker-close')) {
                                                jQ112(this).val('');
                                                jQ112("#cal_text").val("");  // inialize date variables
                                                dateObject1 = "";
                                                clearDateFields();
                                            }
                                        },
                                        onSelect: function() { 
                                        dateObject1 = jQ112(this).datepicker('getDate'); // Στα dateObject κρατάμε τις επιλεγμένες ημερομηνίες 
                                            ResultAcceptance(user_option,user_segment,dateObject1,dateObject2); //Κάθε φορά που επιλέγεται μια ημερομηνία πηγαίνουμε στους ελέγχους 
                                        } 
                                    }); 
                                    jQ112('body').on('click','#cal_button',function(){ 
                                    jQ112("#cal_text").datepicker("show"); 
                                    StoreDate(); 
                                    }); 
                                     
                     
                        $("#cal_text2").datepicker({  // Επιθυμητή ημερομηνία έκδοσης λογαριασμού 

                                        minDate: new Date(), // Η επιθυμητή ημερομηνία πληρωμής είναι πάντα μετά την σημερινή 
                                        firstDay: 1, 
                                        dateFormat: 'dd-mm-yy',
                                        showButtonPanel: true,
                                        closeText: 'Clear', // Text to show for "close" button
                                        onClose: function () {
                                            var event = arguments.callee.caller.caller.arguments[0];
                                            // If "Clear" gets clicked, then really clear it
                                            if (jQ112(event.delegateTarget).hasClass('ui-datepicker-close')) {
                                                jQ112(this).val('');
                                                jQ112("#cal_text2").val("");  // inialize date variables
                                                dateObject2 = "";
                                                clearDateFields();
                                            }
                                        }, 
                                        onSelect: function() { 
                                        dateObject2 = jQ112(this).datepicker('getDate'); // Στα dateObject κρατάμε τις επιλεγμένες ημερομηνίες 
                                            ResultAcceptance(user_option,user_segment,dateObject1,dateObject2); 
                                        } 
                                      });  
                                     jQ112("#cal_button2").click(function(){ 
                                     jQ112("#cal_text2").datepicker("show"); 
                                     StoreDate(); 
                                    });
                    
                        $("#cal_text3").datepicker({  // Ημερομηνία εκδοσης λογαριασμού 

                                        maxDate: new Date(), // Η ημερομηνία έκδοσης είναι σε προγενέστερη ημερομηνία 
                                        firstDay: 1, 
                                        dateFormat: 'dd-mm-yy',
                                        showButtonPanel: true,
                                        closeText: 'Clear', // Text to show for "close" button
                                        onClose: function () {
                                            var event = arguments.callee.caller.caller.arguments[0];
                                            // If "Clear" gets clicked, then really clear it
                                            if ($(event.delegateTarget).hasClass('ui-datepicker-close')) {
                                                jQ112(this).val('');
                                                jQ112("#cal_text3").val("");
                                                secondStepDefillLektiko();//Διορθώνουμε το λεκτικό
                                            }
                                        },
                                        onSelect: function() {  
                                           secondStepFillLektiko();
                                        } 
                                    }); 
                                    jQ112('body').on('click','#cal_button3',function(){ 
                                    jQ112("#cal_text3").datepicker("show"); 
                                    }); 
                    
                        $("#cal_text4").datepicker({  // Ημερομηνία εκδοσης λογαριασμού 

                                        maxDate: new Date(), // Η ημερομηνία έκδοσης είναι σε προγενέστερη ημερομηνία 
                                        firstDay: 1, 
                                        dateFormat: 'dd-mm-yy',
                                        showButtonPanel: true,
                                        closeText: 'Clear', // Text to show for "close" button
                                        onClose: function () {
                                            var event = arguments.callee.caller.caller.arguments[0];
                                            // If "Clear" gets clicked, then really clear it
                                            if (jQ112(event.delegateTarget).hasClass('ui-datepicker-close')) {
                                                jQ112(this).val('');
                                                jQ112("#cal_text4").val("");
                                                secondStepDefillLektiko();//Διορθώνουμε το λεκτικό
                                            }
                                        },
                                        onSelect: function() { 
                                            secondStepFillLektiko();
                                        } 
                                    }); 
                                    jQ112('body').on('click','#cal_button4',function(){ 
                                    jQ112("#cal_text4").datepicker("show"); 
                                    }); 

                            //$.getScript("/commonApplications/Documents/ui/jquery-ui.min.js",function(){   //Add 
                               $.getScript("/CC/SMS_Tool/Documents/sms_tool_new_abacus.js"); 
                            //}); 
                     }); 
                }); 
            }); 
         //}); 
      

</script> 


     
<!-- SMS Tool Τέλος -->    
<script language="javascript" type="text/javascript"> 
          
    
    /* 
     
    TA DATA TIS LISTAS 
     
    */    
    var local = true; //for testing 
    var spType = "SPServices"; //native or SPServices //new portal 
    var jQ112 = jQuery.noConflict(true); 
    var VS = getParameterByName("vs");  
    var second_panel_existance = false; 
    var third_panel_existance = false; 
    var UpperList =[]; 
    var InnerList =[]; 
    var ThirdLevelList =[]; 
    var ExtentionPaymentListChecks = []; 
    var ExtentionPaymentListActions = []; 
    var ArrangementPaymentListChecks = []; 
    var ArrangementPaymentListActions = []; 
    var ArrangementSMSList = []; 
    var myThirdLevelList =[]; 
    var tempUpperList =[]; 
    var tempButtons =[]; 
    var tempInnerButtons =[]; 
    var tempThirdLevelButtons= []; 
    var udate1=""; 
    var udate2 =""; 
    var dateObject1 = ""; 
    var dateObject2 = ""; 
    var user_segment=""; 
    var user_option=""; 
    var final_dose = 0; 
    var acceptance_status = false; 
    var globalsegment = ""; 
    var globalcategory = "" ; 
    var globaloption = ""; 
    var globaltool = "CC";
    var dosi_poso_acceptance = false;
    var lektiko_string = "";

         
jQ112(document).ready(function() { 




if(local || spType == "SPServices") { //new portal 
InitializeAbacus(); //for testing 
} else { 
ExecuteOrDelayUntilScriptLoaded(initializeCalculator, "sp.js"); 
} 
});    
         
         
        function InitializeAbacus()  // θα πρέπει να την καλώ και με το Reset button 
        {       
            RetrieveGreatCategories(); 
            jQ112("#cal_text").val(""); 
            jQ112("#cal_text2").val(""); 
            jQ112("#cal_text3").val(""); 
            jQ112("#cal_text4").val(""); 
        } 
         
         
        function RetrieveGreatCategories() 
        { 
            if(local) 
                { 
                    UpperList = []; //Recycle 
                    //Χτίζουμε τον πίνακα 
                    //UpperList.push({greatcategory:"Collection",second_panel_existance:true,css_class:"uppercat-button-red",procedure:""}); 
                    //UpperList.push({greatcategory:"Disconnection/Legal",second_panel_existance:false,css_class:"uppercat-button-red",procedure:"<h2>Siebel κινητής:</h2><p>Δεν καταχωρώ διακανονισμό σε πρώτο χρόνο αλλά δημιουργώ, όταν αυτό ορίζεται από τη διαδικασία Παράτασης Εξόφλησης για Disconnection/ Legal,</p> <p>Καταχωρώ SR:<br> Type: Θέματα Εισπράξεων <br>Category: Διαχείριση από DL/Legal <br>Subcategory: DL - Αιτούμενος Διακανονισμός <br>Alternative Contact: Τηλέφωνο επικοινωνίας (Απαραίτητη καταγραφή)<br>Στο Dynamic Applet 'Θέματα Εισπράξεων', στο πεδίο Στοιχεία Διακανονισμού συμπληρώνω: <br>Τύπος Διακανονισμού: Επιλέγω αναλόγως <br>Ποσό Διακανονισμού: Ποσό διακανονισμού <br>Ημερομηνία Έκδοσης Λογαριασμού: Η ημερομηνία έκδοσης  ληξιπρόθεσμου λογαριασμού <br>Ημερομηνία Πληρωμής Λογαριασμού: Ημερομηνία που θα εξοφλήσει ο συνδρομητής <br>Ctrl+S και Auto Assign</p>"}); 
                    UpperList.push({greatcategory:"Κινητή",second_panel_existance:true,css_class:"uppercat-button-red",procedure:"<h2>Siebel κινητής:</h2><p>Δεν καταχωρώ διακανονισμό σε πρώτο χρόνο αλλά δημιουργώ, όταν αυτό ορίζεται από τη διαδικασία Παράτασης Εξόφλησης για High Spend, </p><p>Καταχωρώ SR:<br> Type: Θέματα Εισπράξεων<br>Category: HIGH SPEND <br>Subcategory: HS-Αιτούμενος διακανονισμός<br>Alternative Contact: Τηλέφωνο επικοινωνίας<br>Στο Dynamic Applet 'Θέματα Εισπράξεων', στο πεδίο Στοιχεία Διακανονισμού συμπληρώνω:<br>Τύπος Διακανονισμού: Επιλέγω αναλόγως<br>Ποσό Διακανονισμού: Ποσό διακανονισμού<br>Ημερομηνία Έκδοσης Λογαριασμού: Η ημερομηνία έκδοσης  ληξιπρόθεσμου λογαριασμού<br>Ημερομηνία Πληρωμής Λογαριασμού: Ημερομηνία που θα εξοφλήσει ο συνδρομητής<br>Ctrl+S και Auto Assign</p>"}); 
                    UpperList.push({greatcategory:"Σταθερή",second_panel_existance:true,css_class:"uppercat-button-red",procedure:"<h2>Siebel κινητής:</h2><p>Δεν καταχωρώ διακανονισμό σε πρώτο χρόνο αλλά δημιουργώ, όταν αυτό ορίζεται από τη διαδικασία Παράτασης Εξόφλησης για High Usage, </p><p>Καταχωρώ SR:<br> Type: Θέματα Εισπράξεων<br>Category: Διαχείριση από High Usage<br>Subcategory: HU-Αιτούμενος διακανονισμός<br>Alternative Contact: Τηλέφωνο επικοινωνίας<br>Στο Dynamic Applet 'Θέματα Εισπράξεων', στο πεδίο Στοιχεία Διακανονισμού συμπληρώνω:Τύπος Διακανονισμού: Επιλέγω αναλόγως<br>Ποσό Διακανονισμού: Ποσό διακανονισμού<br>Ημερομηνία Έκδοσης Λογαριασμού: Η ημερομηνία έκδοσης  ληξιπρόθεσμου λογαριασμού<br>Ημερομηνία Πληρωμής Λογαριασμού: Ημερομηνία που θα εξοφλήσει ο συνδρομητής<br>Ctrl+S και Auto Assign</p>"}); 
                    //UpperList.push({greatcategory:"Welcome Calls",second_panel_existance:false,css_class:"uppercat-button-red",procedure:"<h2>Siebel κινητής:</h2><p>Δεν καταχωρώ διακανονισμό σε πρώτο χρόνο αλλά δημιουργώ, όταν αυτό ορίζεται από τη διαδικασία Παράτασης Εξόφλησης για Welcome Calls, </p><p>Καταχωρώ SR:<br> Type: Θέματα Εισπράξεων Category: Διαχείριση από Welcome Calls<br>Subcategory: Ενέργειες από Welcome Calls<br>Alternative Contact: Τηλέφωνο επικοινωνίας<br>Ctrl+S και Auto Assign</p>"}); 
                     
                    SetUpUpperCategories(); 
                }
            }
                    
                    
    function RetrieveCollectionCategories() 
    { 
        InnerList =[]; //Recycle 
        InnerList.push({greatcategory:"Collection",category:"No Segmentation/ Bad Payer",third_panel_existance:false,firstchild:"",secondchild:"",procedure:'Ενημερώνω το συνδρομητή για μη δυνατότητα παρατασης βάσει του λεκτικού:<br><br>"<i>Για την διασφάλιση των συνδρομητών μας και της εταιρείας από συσσωρευμένες οφειλές, δεν υπάρχει δυνατότητα παράτασης εξόφλησης του λογαριασμού σας. <br>Ωστόσο, σύμφωνα και με το έντυπο του λογαριασμού σας, έχετε τη δυνατότητα να εξοφλήσετε το λογαριασμό σας έως και 15 ημέρες μετά την έκδοση του επόμενου λογαριασμού".</i>',position:1}); 
        InnerList.push({greatcategory:"Collection",category:"Medium/Low",third_panel_existance:true,firstchild:"Παράταση εξόφλησης",secondchild:"Διακανονισμοί Δόσεων",procedure:"",position:2}); 
        InnerList.push({greatcategory:"Collection",category:"High Value",third_panel_existance:true,firstchild:"Παράταση εξόφλησης",secondchild:"Διακανονισμοί Δόσεων",procedure:"",position:3}); 
        InnerList.push({greatcategory:"Collection",category:"Ultra High Value",third_panel_existance:true,firstchild:"Παράταση εξόφλησης",secondchild:"Διακανονισμοί Δόσεων",procedure:"",position:4}); 
        InnerList.push({greatcategory:"Collection",category:"SAM",third_panel_existance:true,firstchild:"Παράταση εξόφλησης",secondchild:"Διακανονισμοί Δόσεων",procedure:"",position:5}); 
        InnerList.push({greatcategory:"Collection",category:"SoHo",third_panel_existance:true,firstchild:"Παράταση εξόφλησης",secondchild:"Διακανονισμοί Δόσεων",procedure:"",position:6});  	               
    } 
     
    function RetrieveThirdLevelCollectionCategories() 
    { 
         
        ThirdLevelList = []; // Recycle; 
		ThirdLevelList.push({category:"Κινητή",coded_category:"Κινητή",third_panel_existance:true,child:"Παράταση εξόφλησης",accepted_days:"49",position:1}); 
        ThirdLevelList.push({category:"Κινητή",coded_category:"Κινητή",third_panel_existance:true,child:"Διακανονισμοί Δόσεων",accepted_days:"49",position:2}); 
		ThirdLevelList.push({category:"Σταθερή",coded_category:"Κινητή",third_panel_existance:true,child:"Παράταση εξόφλησης",accepted_days:"49",position:1}); 
        ThirdLevelList.push({category:"Σταθερή",coded_category:"Κινητή",third_panel_existance:true,child:"Διακανονισμοί Δόσεων",accepted_days:"49",position:2}); 
		
        // ThirdLevelList.push({category:"Medium/Low",coded_category:"Medium_Low",third_panel_existance:true,child:"Παράταση εξόφλησης",accepted_days:"49",position:1}); 
        // ThirdLevelList.push({category:"Medium/Low",coded_category:"Medium_Low",third_panel_existance:true,child:"Διακανονισμοί Δόσεων",accepted_days:"49",position:2}); 
        // ThirdLevelList.push({category:"High Value",coded_category:"High_Value",third_panel_existance:true,child:"Παράταση εξόφλησης",accepted_days:"63",position:1}); 
        // ThirdLevelList.push({category:"High Value",coded_category:"High_Value",third_panel_existance:true,child:"Διακανονισμοί Δόσεων",accepted_days:"63",position:2}); 
        // ThirdLevelList.push({category:"Ultra High Value",coded_category:"Ultra_High_Value",third_panel_existance:true,child:"Παράταση εξόφλησης",accepted_days:"68",position:1}); 
        // ThirdLevelList.push({category:"Ultra High Value",coded_category:"Ultra_High_Value",third_panel_existance:true,child:"Διακανονισμοί Δόσεων",accepted_days:"68",position:2}); 
        // ThirdLevelList.push({category:"SAM",coded_category:"SAM",third_panel_existance:true,child:"Παράταση εξόφλησης",accepted_days:"68",position:1}); 
        // ThirdLevelList.push({category:"SAM",coded_category:"SAM",third_panel_existance:true,child:"Διακανονισμοί Δόσεων",accepted_days:"68",position:2}); 
        // ThirdLevelList.push({category:"SoHo",coded_category:"SoHo",third_panel_existance:true,child:"Παράταση εξόφλησης",accepted_days:"68",position:1}); 
        // ThirdLevelList.push({category:"SoHo",coded_category:"SoHo",third_panel_existance:true,child:"Διακανονισμοί Δόσεων",accepted_days:"68",position:2}); 
         
        ExtentionPaymentListChecks= []; //Recycle 
        // ExtentionPaymentListChecks.push({category:"Medium/Low",coded_category:"Medium_Low",third_panel_existance:true,check:"<b>Siebel κινητής ελέγχω αν: </b><br><br>Το μητρώο είναι ενεργό.<br>Έχει ήδη ενεργή φραγή καθώς και το λόγο για τον οποίο έχει ενεργοποιηθεί.<br>Έχει ενεργή NBA_PAYMENT_EXTENSION_XXXxx καμπάνια και εφόσον ναι ενημερώνω για αδυναμία παράτασης εξόφλησης.<br>Έχει ενεργή Self Service Settlements καμπάνια και ενημερώνω βάσει διαδικασίας Self Service Διακανονισμών.<br>Έχει δοθεί ξανά παράταση στο μητρώο τους τελευταίους 6 μήνες ενημερώνω για αδυναμία παράτασης εξόφλησης.<br>Το μητρώο περιλαμβάνει μόνο συνδέσεις Καρτοπρογράμματος. Σε αυτή τη περίπτωση ελέγχω αν έχουν παρέλθει 6 μήνες από την ημερομηνία συνδέσεις τους. Αν όχι, δεν θα δίνεται καμία δυνατότητα παράτασης εξόφλησης. <br><br><b>Siebel σταθερής ελέγχω αν: </b><br><br>Το μητρώο είναι ενεργό.<br>Είναι combo συνδρομητής (έχει ενεργό κινητό και σταθερό στη Vodafone) προκειμένου να τον χειριστώ με βάση το Value Segment της Κινητής. <br>Ο συνδρομητής είναι χαρακτηρισμένος Bad Payer (βλ. Νο Segmentation/ Bad Payer)<br>Έχει ήδη ενεργή φραγή καθώς και το λόγο για τον οποίο έχει ενεργοποιηθεί.<br>Έχει δοθεί ξανά παράταση στο μητρώο τους τελευταίους 6 μήνες ενημερώνω για αδυναμία παράτασης εξόφλησης.",position:1}); 
        // ExtentionPaymentListChecks.push({category:"High Value",coded_category:"High_Value",third_panel_existance:true,check:"<b>Ελέγχω αν</b><br><br>Το μητρώο είναι ενεργό.<br><strong>Μόνο για Siebel Σταθερής</strong>: είναι combo συνδρομητής (έχει ενεργό κινητό και σταθερό στη Vodafone) προκειμένου να τον χειριστώ με βάση το Value Segment της Κινητής. <br>Ο συνδρομητής είναι χαρακτηρισμένος Bad Payer (βλ. Νο Segmentation/ Bad Payer)<br>Έχει ήδη ενεργή φραγή καθώς και το λόγο για τον οποίο έχει ενεργοποιηθεί.<br>Έχει ενεργή Self Service Settlements καμπάνια και ενημερώνω βάσει διαδικασίας Self Service Διακανονισμών.<br>Το μητρώο περιλαμβάνει μόνο συνδέσεις Καρτοπρογράμματος. Σε αυτή τη περίπτωση ελέγχω αν έχουν παρέλθει 6 μήνες από την ημερομηνία συνδέσεις τους. Αν όχι, δεν θα δίνεται καμία δυνατότητα παράτασης εξόφλησης. ",position:1});         
        // ExtentionPaymentListChecks.push({category:"Ultra High Value",coded_category:"Ultra_High_Value",third_panel_existance:true,check:"<b>Ελέγχω αν</b><br><br>Το μητρώο είναι ενεργό.<br><strong>Μόνο για Siebel Σταθερής</strong>: είναι combo συνδρομητής (έχει ενεργό κινητό και σταθερό στη Vodafone) προκειμένου να τον χειριστώ με βάση το Value Segment της Κινητής.  <br>Ο συνδρομητής είναι χαρακτηρισμένος Bad Payer (βλ. Νο Segmentation/ Bad Payer)<br>Έχει ήδη ενεργή φραγή καθώς και το λόγο για τον οποίο έχει ενεργοποιηθεί.<br>Έχει ενεργή Self Service Settlements καμπάνια και ενημερώνω βάσει διαδικασίας Self Service Διακανονισμών.<br>Το μητρώο περιλαμβάνει μόνο συνδέσεις Καρτοπρογράμματος. Σε αυτή τη περίπτωση ελέγχω αν έχουν παρέλθει 6 μήνες από την ημερομηνία συνδέσεις τους. Αν όχι, δεν θα δίνεται καμία δυνατότητα παράτασης εξόφλησης. ",position:1});  
        // ExtentionPaymentListChecks.push({category:"SAM",coded_category:"SAM",third_panel_existance:true,check:"<b>Ελέγχω αν</b><br><br>Το μητρώο είναι ενεργό.<br><strong>Μόνο για Siebel Σταθερής</strong>: είναι combo συνδρομητής (έχει ενεργό κινητό και σταθερό στη Vodafone) προκειμένου να τον χειριστώ με βάση το Value Segment της Κινητής.  <br>Ο συνδρομητής είναι χαρακτηρισμένος Bad Payer (βλ. Νο Segmentation/ Bad Payer)<br>Έχει ήδη ενεργή φραγή καθώς και το λόγο για τον οποίο έχει ενεργοποιηθεί.<br>Έχει ενεργή Self Service Settlements καμπάνια και ενημερώνω βάσει διαδικασίας Self Service Διακανονισμών.<br>Το μητρώο περιλαμβάνει μόνο συνδέσεις Καρτοπρογράμματος. Σε αυτή τη περίπτωση ελέγχω αν έχουν παρέλθει 6 μήνες από την ημερομηνία συνδέσεις τους. Αν όχι, δεν θα δίνεται καμία δυνατότητα παράτασης εξόφλησης. ",position:1}); 
        // ExtentionPaymentListChecks.push({category:"SoHo",coded_category:"SoHo",third_panel_existance:true,check:"<b>Ελέγχω αν</b><br><br>Το μητρώο είναι ενεργό.<br><strong>Μόνο για Siebel Σταθερής</strong>: είναι combo συνδρομητής (έχει ενεργό κινητό και σταθερό στη Vodafone) προκειμένου να τον χειριστώ με βάση το Value Segment της Κινητής.  <br>Ο συνδρομητής είναι χαρακτηρισμένος Bad Payer (βλ. Νο Segmentation/ Bad Payer)<br>Έχει ήδη ενεργή φραγή καθώς και το λόγο για τον οποίο έχει ενεργοποιηθεί.<br>Έχει ενεργή Self Service Settlements καμπάνια και ενημερώνω βάσει διαδικασίας Self Service Διακανονισμών.<br>Το μητρώο περιλαμβάνει μόνο συνδέσεις Καρτοπρογράμματος. Σε αυτή τη περίπτωση ελέγχω αν έχουν παρέλθει 6 μήνες από την ημερομηνία συνδέσεις τους. Αν όχι, δεν θα δίνεται καμία δυνατότητα παράτασης εξόφλησης. ",position:1}); 
        ExtentionPaymentListChecks.push({category:"Κινητή",coded_category:"Κινητή",third_panel_existance:true,check:"<b>Ελέγχω αν</b><br><br>Το μητρώο είναι ενεργό.<br><strong>Μόνο για Siebel Σταθερής</strong>: είναι combo συνδρομητής (έχει ενεργό κινητό και σταθερό στη Vodafone) προκειμένου να τον χειριστώ με βάση το Value Segment της Κινητής.  <br>Ο συνδρομητής είναι χαρακτηρισμένος Bad Payer (βλ. Νο Segmentation/ Bad Payer)<br>Έχει ήδη ενεργή φραγή καθώς και το λόγο για τον οποίο έχει ενεργοποιηθεί.<br>Έχει ενεργή Self Service Settlements καμπάνια και ενημερώνω βάσει διαδικασίας Self Service Διακανονισμών.<br>Το μητρώο περιλαμβάνει μόνο συνδέσεις Καρτοπρογράμματος. Σε αυτή τη περίπτωση ελέγχω αν έχουν παρέλθει 6 μήνες από την ημερομηνία συνδέσεις τους. Αν όχι, δεν θα δίνεται καμία δυνατότητα παράτασης εξόφλησης. ",position:1}); 
        ExtentionPaymentListChecks.push({category:"Σταθερή",coded_category:"Σταθερή",third_panel_existance:true,check:"<b>Ελέγχω αν</b><br><br>Το μητρώο είναι ενεργό.<br><strong>Μόνο για Siebel Σταθερής</strong>: είναι combo συνδρομητής (έχει ενεργό κινητό και σταθερό στη Vodafone) προκειμένου να τον χειριστώ με βάση το Value Segment της Κινητής.  <br>Ο συνδρομητής είναι χαρακτηρισμένος Bad Payer (βλ. Νο Segmentation/ Bad Payer)<br>Έχει ήδη ενεργή φραγή καθώς και το λόγο για τον οποίο έχει ενεργοποιηθεί.<br>Έχει ενεργή Self Service Settlements καμπάνια και ενημερώνω βάσει διαδικασίας Self Service Διακανονισμών.<br>Το μητρώο περιλαμβάνει μόνο συνδέσεις Καρτοπρογράμματος. Σε αυτή τη περίπτωση ελέγχω αν έχουν παρέλθει 6 μήνες από την ημερομηνία συνδέσεις τους. Αν όχι, δεν θα δίνεται καμία δυνατότητα παράτασης εξόφλησης. ",position:1}); 
        
        ExtentionPaymentListActions = []; //Recycle 
        // ExtentionPaymentListActions.push({category:"Medium/Low",coded_category:"Medium_Low",third_panel_existance:true,action:"<b>Siebel κινητής συμπληρώνω SR (σε επίπεδο μητρώου):</b><br><br>Type: Θέματα Εισπράξεων<br>Category: Διακανονισμός Οφειλής<br>Subcategory: Συμφωνημένος Διακανονισμός<br>Στο Dynamic Applet 'Θέματα Εισπράξεων' συμπληρώνω τις τιμές στο πεδίο Στοιχεία Διακανονισμού:<br>Τύπο διακανονισμού: (επιλέγω αναλόγως)<br>Ποσό διακανονισμού: (Το ποσό που είναι προς παράταση)<br>Ημερομηνία έκδοσης λογαριασμού: (Την ημ/νία έκδοσης του λογαριασμού)<br>Ημερομηνία πληρωμής διακαν.ποσού: (Την ημερομηνία που επιθυμεί να εξοφλήσει ο συνδρομητής)<br>Στο πεδίο Contact Details αλλάζω το status στο Auto SMS Upon Creation σε FCR<br>Ctrl +S και Auto Assign και στη συνέχεια αλλάζω το status σε Closed<br>Αν έχει ενεργή φραγή συμπληρώνω Order 'Bar/Unbar' για απενεργοποίηση της.<br><br><b>Siebel σταθερής συμπληρώνω SR:</b><br><br>Περιοχή: Λογαριασμοί & Χρεώσεις<br>Υπο-περιοχή: Διακανονισμός<br>Αποτέλεσμα κλήσης: Εκρεμμεί έλεγχος / Ενημέρωση<br>και αναγράφω τις λεπτομέρειες του διακανονισμού<br><br><b>Δεν ξεχνώ:</b><br><br>Η παράταση εξόφλησης θα αφορά το σύνολο των ληξιπρόθεσμων οφειλών και θα υπολογίζεται με βάση την ημερομηνία του παλαιότερου λογαριασμού<br>Η παράταση θα πρέπει να δίνεται σύμφωνα με το αίτημα και τις ανάγκες του συνδρομητή και σε καμία περίπτωση να μην δίνεται απευθείας το μέγιστό των ημερών<br>Σε περιπτώσεις όπου το ποσό πληρωμής υπερβαίνει τα 500€ ενημερώνω τον συνδρομητή ότι η πληρωμή δεν μπορεί να γίνει με μετρητά<br>Στην περίπτωση συνδρομητών με Δόσεις Συσκευής στο λογαριασμό ενημερώνουμε ότι δεν είναι εφικτός διακανονισμός με δόσεις καθώς η οφειλή περιλαμβάνει ήδη δόσεις και προτείνουμε εναλλακτικά να κάνει πληρωμή με πιστωτική κάρτα και να βάλει τις δόσεις στην τράπεζα άτοκα",position:1}); 
        // ExtentionPaymentListActions.push({category:"High Value",coded_category:"High_Value",third_panel_existance:true,action:"<b>Siebel κινητής συμπληρώνω SR (σε επίπεδο μητρώου):</b><br><br>Type: Θέματα Εισπράξεων<br>Category: Διακανονισμός Οφειλής<br>Subcategory: Συμφωνημένος Διακανονισμός<br>Στο Dynamic Applet 'Θέματα Εισπράξεων' συμπληρώνω τις τιμές στο πεδίο Στοιχεία Διακανονισμού:<br>Τύπο διακανονισμού: (επιλέγω αναλόγως)<br>Ποσό διακανονισμού: (Το ποσό που είναι προς παράταση)<br>Ημερομηνία έκδοσης λογαριασμού: (Την ημ/νία έκδοσης του λογαριασμού)<br>Ημερομηνία πληρωμής διακαν.ποσού: (Την ημερομηνία που επιθυμεί να εξοφλήσει ο συνδρομητής)<br>Στο πεδίο Contact Details αλλάζω το status στο Auto SMS Upon Creation σε FCR<br>Ctrl +S και Auto Assign και στη συνέχεια αλλάζω το status σε Closed<br>Αν έχει ενεργή φραγή συμπληρώνω Order 'Bar/Unbar' για απενεργοποίηση της.<br><br><b>Siebel σταθερής συμπληρώνω SR:</b><br><br>Περιοχή: Λογαριασμοί & Χρεώσεις<br>Υπο-περιοχή: Διακανονισμός<br>Αποτέλεσμα κλήσης: Εκρεμμεί έλεγχος / Ενημέρωση<br>και αναγράφω τις λεπτομέρειες του διακανονισμού<br><br><b>Δεν ξεχνώ:</b><br><br>Η παράταση εξόφλησης θα αφορά το σύνολο των ληξιπρόθεσμων οφειλών και θα υπολογίζεται με βάση την ημερομηνία του παλαιότερου λογαριασμού<br>Η παράταση θα πρέπει να δίνεται σύμφωνα με το αίτημα και τις ανάγκες του συνδρομητή και σε καμία περίπτωση να μην δίνεται απευθείας το μέγιστό των ημερών<br>Σε περιπτώσεις όπου το ποσό πληρωμής υπερβαίνει τα 500€ ενημερώνω τον συνδρομητή ότι η πληρωμή δεν μπορεί να γίνει με μετρητά<br>Στην περίπτωση συνδρομητών με Δόσεις Συσκευής στο λογαριασμό ενημερώνουμε ότι δεν είναι εφικτός διακανονισμός με δόσεις καθώς η οφειλή περιλαμβάνει ήδη δόσεις και προτείνουμε εναλλακτικά να κάνει πληρωμή με πιστωτική κάρτα και να βάλει τις δόσεις στην τράπεζα άτοκα",position:1});   
        // ExtentionPaymentListActions.push({category:"Ultra High Value",coded_category:"Ultra_High_Value",third_panel_existance:true,action:"<b>Siebel κινητής συμπληρώνω SR (σε επίπεδο μητρώου) :</b><br><br>Type: Θέματα Εισπράξεων<br>Category: Διακανονισμός Οφειλής<br>Subcategory: Συμφωνημένος Διακανονισμός<br>Στο Dynamic Applet 'Θέματα Εισπράξεων' συμπληρώνω τις τιμές στο πεδίο Στοιχεία Διακανονισμού:<br>Τύπο διακανονισμού: (επιλέγω αναλόγως)<br>Ποσό διακανονισμού: (Το ποσό που είναι προς παράταση)<br>Ημερομηνία έκδοσης λογαριασμού: (Την ημ/νία έκδοσης του λογαριασμού)<br>Ημερομηνία πληρωμής διακαν.ποσού: (Την ημερομηνία που επιθυμεί να εξοφλήσει ο συνδρομητής)<br>Στο πεδίο Contact Details αλλάζω το status στο Auto SMS Upon Creation σε FCR<br>Ctrl +S και Auto Assign και στη συνέχεια αλλάζω το status σε Closed<br>Αν έχει ενεργή φραγή συμπληρώνω Order 'Bar/Unbar' για απενεργοποίηση της.<br><br><b>Siebel σταθερής συμπληρώνω SR:</b><br><br>Περιοχή: Λογαριασμοί & Χρεώσεις<br>Υπο-περιοχή: Διακανονισμός<br>Αποτέλεσμα κλήσης: Εκρεμμεί έλεγχος / Ενημέρωση<br>και αναγράφω τις λεπτομέριες του διακανονισμού<br><br><b>Δεν ξεχνώ:</b><br><br>Η παράταση εξόφλησης θα αφορά το σύνολο των ληξιπρόθεσμων οφειλών και θα υπολογίζεται με βάση την ημερομηνία του παλαιότερου λογαριασμού<br>Η παράταση θα πρέπει να δίνεται σύμφωνα με το αίτημα και τις ανάγκες του συνδρομητή και σε καμία περίπτωση να μην δίνεται απευθείας το μέγιστό των ημερών<br>Σε περιπτώσεις όπου το ποσό πληρωμής υπερβαίνει τα 500€ ενημερώνω τον συνδρομητή ότι η πληρωμή δεν μπορεί να γίνει με μετρητά<br>Στην περίπτωση συνδρομητών με Δόσεις Συσκευής στο λογαριασμό ενημερώνουμε ότι δεν είναι εφικτός διακανονισμός με δόσεις καθώς η οφειλή περιλαμβάνει ήδη δόσεις και προτείνουμε εναλλακτικά να κάνει πληρωμή με πιστωτική κάρτα και να βάλει τις δόσεις στην τράπεζα άτοκα",position:1});  
        // ExtentionPaymentListActions.push({category:"SAM",coded_category:"SAM",third_panel_existance:true,action:"<b>Siebel κινητής συμπληρώνω SR (σε επίπεδο μητρώου) :</b><br><br>Type: Θέματα Εισπράξεων<br>Category: Διακανονισμός Οφειλής<br>Subcategory: Συμφωνημένος Διακανονισμός<br>Στο Dynamic Applet 'Θέματα Εισπράξεων' συμπληρώνω τις τιμές στο πεδίο Στοιχεία Διακανονισμού:<br>Τύπο διακανονισμού: (επιλέγω αναλόγως)<br>Ποσό διακανονισμού: (Το ποσό που είναι προς παράταση)<br>Ημερομηνία έκδοσης λογαριασμού: (Την ημ/νία έκδοσης του λογαριασμού)<br>Ημερομηνία πληρωμής διακαν.ποσού: (Την ημερομηνία που επιθυμεί να εξοφλήσει ο συνδρομητής)<br>Στο πεδίο Contact Details αλλάζω το status στο Auto SMS Upon Creation σε FCR<br>Ctrl +S και Auto Assign και στη συνέχεια αλλάζω το status σε Closed<br>Αν έχει ενεργή φραγή συμπληρώνω Order 'Bar/Unbar' για απενεργοποίηση της.<br><br><b>Siebel σταθερής συμπληρώνω SR:</b><br><br>Περιοχή: Λογαριασμοί & Χρεώσεις<br>Υπο-περιοχή: Διακανονισμός<br>Αποτέλεσμα κλήσης: Εκρεμμεί έλεγχος / Ενημέρωση<br>και αναγράφω τις λεπτομέριες του διακανονισμού<br><br><b>Δεν ξεχνώ:</b><br><br>Η παράταση εξόφλησης θα αφορά το σύνολο των ληξιπρόθεσμων οφειλών και θα υπολογίζεται με βάση την ημερομηνία του παλαιότερου λογαριασμού<br>Η παράταση θα πρέπει να δίνεται σύμφωνα με το αίτημα και τις ανάγκες του συνδρομητή και σε καμία περίπτωση να μην δίνεται απευθείας το μέγιστό των ημερών<br>Σε περιπτώσεις όπου το ποσό πληρωμής υπερβαίνει τα 500€ ενημερώνω τον συνδρομητή ότι η πληρωμή δεν μπορεί να γίνει με μετρητά<br>Στην περίπτωση συνδρομητών με Δόσεις Συσκευής στο λογαριασμό ενημερώνουμε ότι δεν είναι εφικτός διακανονισμός με δόσεις καθώς η οφειλή περιλαμβάνει ήδη δόσεις και προτείνουμε εναλλακτικά να κάνει πληρωμή με πιστωτική κάρτα και να βάλει τις δόσεις στην τράπεζα άτοκα",position:1});    
        // ExtentionPaymentListActions.push({category:"SoHo",coded_category:"SoHo",third_panel_existance:true,action:"<b>Siebel κινητής συμπληρώνω SR (σε επίπεδο μητρώου) :</b><br><br>Type: Θέματα Εισπράξεων<br>Category: Διακανονισμός Οφειλής<br>Subcategory: Συμφωνημένος Διακανονισμός<br>Στο Dynamic Applet 'Θέματα Εισπράξεων' συμπληρώνω τις τιμές στο πεδίο Στοιχεία Διακανονισμού:<br>Τύπο διακανονισμού: (επιλέγω αναλόγως)<br>Ποσό διακανονισμού: (Το ποσό που είναι προς παράταση)<br>Ημερομηνία έκδοσης λογαριασμού: (Την ημ/νία έκδοσης του λογαριασμού)<br>Ημερομηνία πληρωμής διακαν.ποσού: (Την ημερομηνία που επιθυμεί να εξοφλήσει ο συνδρομητής)<br>Στο πεδίο Contact Details αλλάζω το status στο Auto SMS Upon Creation σε FCR<br>Ctrl +S και Auto Assign και στη συνέχεια αλλάζω το status σε Closed<br>Αν έχει ενεργή φραγή συμπληρώνω Order 'Bar/Unbar' για απενεργοποίηση της.<br><br><b>Siebel σταθερής συμπληρώνω SR:</b><br><br>Περιοχή: Λογαριασμοί & Χρεώσεις<br>Υπο-περιοχή: Διακανονισμός<br>Αποτέλεσμα κλήσης: Εκρεμμεί έλεγχος / Ενημέρωση<br>και αναγράφω τις λεπτομέριες του διακανονισμού<br><br><b>Δεν ξεχνώ:</b><br><br>Η παράταση εξόφλησης θα αφορά το σύνολο των ληξιπρόθεσμων οφειλών και θα υπολογίζεται με βάση την ημερομηνία του παλαιότερου λογαριασμού<br>Η παράταση θα πρέπει να δίνεται σύμφωνα με το αίτημα και τις ανάγκες του συνδρομητή και σε καμία περίπτωση να μην δίνεται απευθείας το μέγιστό των ημερών<br>Σε περιπτώσεις όπου το ποσό πληρωμής υπερβαίνει τα 500€ ενημερώνω τον συνδρομητή ότι η πληρωμή δεν μπορεί να γίνει με μετρητά<br>Στην περίπτωση συνδρομητών με Δόσεις Συσκευής στο λογαριασμό ενημερώνουμε ότι δεν είναι εφικτός διακανονισμός με δόσεις καθώς η οφειλή περιλαμβάνει ήδη δόσεις και προτείνουμε εναλλακτικά να κάνει πληρωμή με πιστωτική κάρτα και να βάλει τις δόσεις στην τράπεζα άτοκα",position:1}); 
        ExtentionPaymentListActions.push({category:"Κινητή",coded_category:"Κινητή",third_panel_existance:true,action:"<b>Siebel κινητής συμπληρώνω SR (σε επίπεδο μητρώου) :</b><br><br>Type: Θέματα Εισπράξεων<br>Category: Διακανονισμός Οφειλής<br>Subcategory: Συμφωνημένος Διακανονισμός<br>Στο Dynamic Applet 'Θέματα Εισπράξεων' συμπληρώνω τις τιμές στο πεδίο Στοιχεία Διακανονισμού:<br>Τύπο διακανονισμού: (επιλέγω αναλόγως)<br>Ποσό διακανονισμού: (Το ποσό που είναι προς παράταση)<br>Ημερομηνία έκδοσης λογαριασμού: (Την ημ/νία έκδοσης του λογαριασμού)<br>Ημερομηνία πληρωμής διακαν.ποσού: (Την ημερομηνία που επιθυμεί να εξοφλήσει ο συνδρομητής)<br>Στο πεδίο Contact Details αλλάζω το status στο Auto SMS Upon Creation σε FCR<br>Ctrl +S και Auto Assign και στη συνέχεια αλλάζω το status σε Closed<br>Αν έχει ενεργή φραγή συμπληρώνω Order 'Bar/Unbar' για απενεργοποίηση της.<br><br><b>Siebel σταθερής συμπληρώνω SR:</b><br><br>Περιοχή: Λογαριασμοί & Χρεώσεις<br>Υπο-περιοχή: Διακανονισμός<br>Αποτέλεσμα κλήσης: Εκρεμμεί έλεγχος / Ενημέρωση<br>και αναγράφω τις λεπτομέριες του διακανονισμού<br><br><b>Δεν ξεχνώ:</b><br><br>Η παράταση εξόφλησης θα αφορά το σύνολο των ληξιπρόθεσμων οφειλών και θα υπολογίζεται με βάση την ημερομηνία του παλαιότερου λογαριασμού<br>Η παράταση θα πρέπει να δίνεται σύμφωνα με το αίτημα και τις ανάγκες του συνδρομητή και σε καμία περίπτωση να μην δίνεται απευθείας το μέγιστό των ημερών<br>Σε περιπτώσεις όπου το ποσό πληρωμής υπερβαίνει τα 500€ ενημερώνω τον συνδρομητή ότι η πληρωμή δεν μπορεί να γίνει με μετρητά<br>Στην περίπτωση συνδρομητών με Δόσεις Συσκευής στο λογαριασμό ενημερώνουμε ότι δεν είναι εφικτός διακανονισμός με δόσεις καθώς η οφειλή περιλαμβάνει ήδη δόσεις και προτείνουμε εναλλακτικά να κάνει πληρωμή με πιστωτική κάρτα και να βάλει τις δόσεις στην τράπεζα άτοκα",position:1});    
        ExtentionPaymentListActions.push({category:"Σταθερή",coded_category:"Σταθερή",third_panel_existance:true,action:"<b>Siebel κινητής συμπληρώνω SR (σε επίπεδο μητρώου) :</b><br><br>Type: Θέματα Εισπράξεων<br>Category: Διακανονισμός Οφειλής<br>Subcategory: Συμφωνημένος Διακανονισμός<br>Στο Dynamic Applet 'Θέματα Εισπράξεων' συμπληρώνω τις τιμές στο πεδίο Στοιχεία Διακανονισμού:<br>Τύπο διακανονισμού: (επιλέγω αναλόγως)<br>Ποσό διακανονισμού: (Το ποσό που είναι προς παράταση)<br>Ημερομηνία έκδοσης λογαριασμού: (Την ημ/νία έκδοσης του λογαριασμού)<br>Ημερομηνία πληρωμής διακαν.ποσού: (Την ημερομηνία που επιθυμεί να εξοφλήσει ο συνδρομητής)<br>Στο πεδίο Contact Details αλλάζω το status στο Auto SMS Upon Creation σε FCR<br>Ctrl +S και Auto Assign και στη συνέχεια αλλάζω το status σε Closed<br>Αν έχει ενεργή φραγή συμπληρώνω Order 'Bar/Unbar' για απενεργοποίηση της.<br><br><b>Siebel σταθερής συμπληρώνω SR:</b><br><br>Περιοχή: Λογαριασμοί & Χρεώσεις<br>Υπο-περιοχή: Διακανονισμός<br>Αποτέλεσμα κλήσης: Εκρεμμεί έλεγχος / Ενημέρωση<br>και αναγράφω τις λεπτομέριες του διακανονισμού<br><br><b>Δεν ξεχνώ:</b><br><br>Η παράταση εξόφλησης θα αφορά το σύνολο των ληξιπρόθεσμων οφειλών και θα υπολογίζεται με βάση την ημερομηνία του παλαιότερου λογαριασμού<br>Η παράταση θα πρέπει να δίνεται σύμφωνα με το αίτημα και τις ανάγκες του συνδρομητή και σε καμία περίπτωση να μην δίνεται απευθείας το μέγιστό των ημερών<br>Σε περιπτώσεις όπου το ποσό πληρωμής υπερβαίνει τα 500€ ενημερώνω τον συνδρομητή ότι η πληρωμή δεν μπορεί να γίνει με μετρητά<br>Στην περίπτωση συνδρομητών με Δόσεις Συσκευής στο λογαριασμό ενημερώνουμε ότι δεν είναι εφικτός διακανονισμός με δόσεις καθώς η οφειλή περιλαμβάνει ήδη δόσεις και προτείνουμε εναλλακτικά να κάνει πληρωμή με πιστωτική κάρτα και να βάλει τις δόσεις στην τράπεζα άτοκα",position:1});    
       
	   
	   var arrangementsMsg = '<b>(1)</b> Η διαδικασία <b>Διακανονισμού Δόσεων</b> ακολουθείται:<ul><li><b>ΜΟΝΟ εφόσον το ζητήσει ο ίδιος ο συνδρομητής</b></li><li>αν επικαλεστεί <b>αδυναμία εξόφλησης λόγω ανεργίας ή οικονομικής δυσχέρειας</b></li><br/><b>ΔΕΝ κάνουμε Διακανονισμό Δόσεων</b><br/><br/><br/><b>(2) Ποσό Διακανονισμού* -> </b> Συνολικό Οφειλόμενο Ποσό (Ληξιπρόθεσμο + τρέχον ποσό)<br/><br/><b>(3) Επιτρεπτός Αριθμός Δόσεων</b>Ο συνδρομητής μπορεί να πάρει <b> έως 5 ισόποσες μηνιαίες δόσεις, </b>  ανάλογα με το συνολικό ύψος της οφειλής του.<br/><table class="diakanonismos_actions"><tr><th class="diakanonismos_actions">Συνολικό οφειλόμενο ποσό λογαριασμού</th><th class="diakanonismos_actions">Ισόποσες Δόσεις</th></tr><tr class="diakanonismos_actions"><td>100-199€</td><td>2</td></tr><tr class="diakanonismos_actions"><td>200-499€</td><td>έως 3</td></tr><tr class="diakanonismos_actions"><td>500-699€</td><td>έως 4</td></tr><tr class="diakanonismos_actions"><td>700€+</td><td>έως 5</td></tr></table> ';
        ArrangementPaymentListChecks = []; //Recycle 
        // ArrangementPaymentListChecks.push({category:"Medium/Low",coded_category:"Medium_Low",third_panel_existance:true,check:"<b>Ελέγχω αν: </b><br><br>Το μητρώο είναι ενεργό.<br>Ο συνδρομητής είναι χαρακτηρισμένος Bad Payer (βλ. Νο Segmentation/ Bad Payer)<br>Έχει ήδη ενεργή φραγή καθώς το λόγο για τον οποίο έχει ενεργοποιηθεί.<br>Ο συνδρομητής μπορεί να ζητήσει διακανονισμό με δόσεις λόγω ανεργίας μόνο 1 φορά (σε ετήσια βάση 01/01-31/12).",position:1}); 
        // ArrangementPaymentListChecks.push({category:"High Value",coded_category:"High_Value",third_panel_existance:true,check:"<b>Ελέγχω αν: </b><br><br>Το μητρώο είναι ενεργό.<br>Ο συνδρομητής είναι χαρακτηρισμένος Bad Payer (βλ. Νο Segmentation/ Bad Payer)<br>Έχει ήδη ενεργή φραγή καθώς το λόγο για τον οποίο έχει ενεργοποιηθεί.<br>Ο συνδρομητής μπορεί να ζητήσει διακανονισμό με δόσεις λόγω ανεργίας μόνο 1 φορά (σε ετήσια βάση 01/01-31/12).",position:1});   
        // ArrangementPaymentListChecks.push({category:"Ultra High Value",coded_category:"Ultra_High_Value",third_panel_existance:true,check:"<b>Ελέγχω αν: </b><br><br>Το μητρώο είναι ενεργό.<br>Ο συνδρομητής είναι χαρακτηρισμένος Bad Payer (βλ. Νο Segmentation/ Bad Payer)<br>Έχει ήδη ενεργή φραγή καθώς το λόγο για τον οποίο έχει ενεργοποιηθεί.<br>Ο συνδρομητής μπορεί να ζητήσει διακανονισμό με δόσεις λόγω ανεργίας μόνο 1 φορά (σε ετήσια βάση 01/01-31/12).",position:1});  
        // ArrangementPaymentListChecks.push({category:"SAM",coded_category:"SAM",third_panel_existance:true,check:"<b>Ελέγχω αν: </b><br><br>Το μητρώο είναι ενεργό.<br>Ο συνδρομητής είναι χαρακτηρισμένος Bad Payer (βλ. Νο Segmentation/ Bad Payer)<br>Έχει ήδη ενεργή φραγή καθώς το λόγο για τον οποίο έχει ενεργοποιηθεί.<br>Ο συνδρομητής μπορεί να ζητήσει διακανονισμό με δόσεις λόγω ανεργίας μόνο 1 φορά (σε ετήσια βάση 01/01-31/12).<br>",position:1}); 
        // ArrangementPaymentListChecks.push({category:"SoHo",coded_category:"SoHo",third_panel_existance:true,check:"<b>Ελέγχω αν:</b><br><br>Το μητρώο είναι ενεργό.<br>Ο συνδρομητής είναι χαρακτηρισμένος Bad Payer (βλ. Νο Segmentation/ Bad Payer)<br>Έχει ήδη ενεργή φραγή καθώς το λόγο για τον οποίο έχει ενεργοποιηθεί.<br>Ο συνδρομητής μπορεί να ζητήσει διακανονισμό με δόσεις 2 φορες (σε ετήσια βάση 01/01-31/12). Για να δοθεί ο δεύτερος διακανονισμός θα πρέπει απαραίτητα να έχει τηρηθεί ο πρώτος.  ",position:1}); 
        ArrangementPaymentListChecks.push({category:"Κινητή",coded_category:"Κινητή",third_panel_existance:true,check:arrangementsMsg,position:1}); 
        ArrangementPaymentListChecks.push({category:"Σταθερή",coded_category:"Κινητή",third_panel_existance:true,check:arrangementsMsg,position:1});
                
        ArrangementPaymentListActions = []; //Recycle 
        // ArrangementPaymentListActions.push({category:"Medium/Low",coded_category:"Medium_Low",third_panel_existance:true,action:"<b>Siebel κινητής</b><br><br>1. Ενεργοποιώ φραγής, Περιαγωγής (BRR), Διεθνών Κλήσεων (BRI), Εξερχομένων κλήσεων προς αριθμούς υψηλής χρέωσης(BPRV).<br>2. Συμπληρώνω SR (σε επίπεδο μητρώου) : <br>Type: Θέματα Εισπράξεων<br>Category: Διακανονισμός Οφειλής<br>Subcategory: Διακανονισμός με Δόσεις<br>Comments: Άνεργος/Οικονομική δυσχέρεια και το λεκτικό από το πεδίο Λεκτικό SR του Εργαλείου Διακανονισμών<br>Στο Dynamic Applet 'Θέματα Εισπράξεων', στο πεδίο Στοιχεία Διακανονισμού συμπληρώνω την ημερομηνία πληρωμής της 1ης δόσης (μόνο)<br>Ctrl +S , Auto Assign και τέλος κάνω Closed το SR<br><strong>Σημείωση</strong><br>Επιλέγοντας Auto Assign εμφανίζεται popup μήνυμα που αναφέρει: <i>'Επιβεβαιώστε ότι το αίτημα έχει ολοκληρωθεί σε πρώτο χρόνο και επιλέξτε status Closed'</i>.<br>Το συγκεκριμένο μήνυμα θα πρέπει να αγνοείται σε περίπτωση καταχώρησης διακανονισμού σε δόσεις, πατώντας το ΟΚ. <br>3. Ενημερώνω το συνδρομητή πως μόλις εξοφλήσει την 1η δόση θα πρέπει να μας καλέσει εκ νέου. Αν πριν την καταβολή της 1ης  δόσης ο συνδρομητής είχε φραγή, μόλις την καταβάλει θα μπορεί να γίνει άρση της φραγής.<br><br><b>Siebel σταθερής:</b><br><br>1. Συμπληρώνω smartscript SR:<br>Περιοχή: Λογαριασμοί & Χρεώσεις <br>Υπο-περιοχή: Διακανονισμός με δόσεις<br>Αποτέλεσμα κλήσης: Εκκρεμεί έλεγχος / Ενημέρωση<br>Θέμα: Διακανονισμός με δόσεις για ανέργους και οικονομική δυσχέρεια<br>Λεπτομερής Περιγραφή: Κάνω Copy το λεκτικό του SR<br>Τμήμα: Credit Control <br>2. Ενημερώνω το συνδρομητή πως μόλις εξοφλήσει την 1η δόση θα πρέπει να μας καλέσει εκ νέου. Αν πριν την καταβολή της 1ης  δόσης ο συνδρομητής είχε φραγή, μόλις την καταβάλει θα μπορεί να γίνει άρση της φραγής.<br><b>Δεν ξεχνώ:</b><br><br>Διακανονισμοί δόσεων γίνονται δεκτοί για ποσά μεγαλύτερα των 100 ευρώ<br>Διακανονισμός με δόσεις μπορεί να δοθεί μόνο μία (1) φορά το χρόνο <br>Διακανονισμός με δόσεις δε μπορεί να γίνει σε συνδρομητές με credit segment P & 0, που είναι ενταγμένοι σε ενεργή (active) Port Out καμπάνια και Medium/ Low που συμμετέχουν στην καμπάνια NBA_PAYMENT_EXTENSION_XXXxx <br>Ο διακανονισμός καταχωρείται πάντα για το σύνολο του οφειλώμενου ποσού (ληξιπρόθεσμου και μη)<br>Παράλληλα με την καταβολή των δόσεων, οι νέοι λογαριασμοί που εκδίδονται θα πρέπει να εξοφλούνται έως την ημερομηνία λήξης τους<br>Σε περιπτώσεις όπου το ποσό πληρωμής υπερβαίνει τα 500€ ενημερώνω τον συνδρομητή ότι η πληρωμή δεν μπορεί να γίνει με μετρητά<br>Στην περίπτωση συνδρομητών με Δόσεις Συσκευής στο λογαριασμό ενημερώνουμε ότι δεν είναι εφικτός διακανονισμός με δόσεις καθώς η οφειλή περιλαμβάνει ήδη δόσεις και προτείνουμε εναλλακτικά να κάνει πληρωμή με πιστωτική κάρτα και να βάλει τις δόσεις στην τράπεζα άτοκα",position:1}); 
        // ArrangementPaymentListActions.push({category:"High Value",coded_category:"High_Value",third_panel_existance:true,action:"<b>Siebel κινητής</b><br><br>1. Ενεργοποιώ φραγής, Περιαγωγής (BRR), Διεθνών Κλήσεων (BRI), Εξερχομένων κλήσεων προς αριθμούς υψηλής χρέωσης(BPRV)<br>2. Συμπληρώνω SR (σε επίπεδο μητρώου) : <br>Type: Θέματα Εισπράξεων<br>Category: Διακανονισμός Οφειλής<br>Subcategory: Διακανονισμός με Δόσεις<br>Comments: Άνεργος/Οικονομική δυσχέρεια και το λεκτικό από το πεδίο Λεκτικό SR του Εργαλείου Διακανονισμών<br>Στο Dynamic Applet 'Θέματα Εισπράξεων', στο πεδίο Στοιχεία Διακανονισμού συμπληρώνω την ημερομηνία πληρωμής της 1ης δόσης (μόνο)<br>Ctrl +S , Auto Assign και τέλος κάνω Closed το SR<strong><br>Σημείωση</strong><br>Επιλέγοντας Auto Assign εμφανίζεται popup μήνυμα που αναφέρει: <i>'Επιβεβαιώστε ότι το αίτημα έχει ολοκληρωθεί σε πρώτο χρόνο και επιλέξτε status Closed'</i>.<br>Το συγκεκριμένο μήνυμα θα πρέπει να αγνοείται σε περίπτωση καταχώρησης διακανονισμού σε δόσεις, πατώντας το ΟΚ<br>3. Ενημερώνω το συνδρομητή πως μόλις εξοφλήσει την 1η δόση θα πρέπει να μας καλέσει εκ νέου. Αν πριν την καταβολή της 1ης  δόσης ο συνδρομητής είχε φραγή, μόλις την καταβάλει θα μπορεί να γίνει άρση της φραγής.<br><br><b>Siebel σταθερής:</b><br><br>1. Συμπληρώνω smartscript SR:<br>Περιοχή: Λογαριασμοί & Χρεώσεις <br>Υπο-περιοχή: Διακανονισμός με δόσεις<br>Αποτέλεσμα κλήσης: Εκκρεμεί έλεγχος / Ενημέρωση<br>Θέμα: Διακανονισμός με δόσεις για ανέργους και οικονομική δυσχέρεια<br>Λεπτομερής Περιγραφή: Κάνω Copy το λεκτικό του SR<br>Τμήμα: Credit Control<br>2. Ενημερώνω το συνδρομητή πως μόλις εξοφλήσει την 1η δόση θα πρέπει να μας καλέσει εκ νέου. Αν πριν την καταβολή της 1ης  δόσης ο συνδρομητής είχε φραγή, μόλις την καταβάλει θα μπορεί να γίνει άρση της φραγής. <br><br><b>Δεν ξεχνώ:</b><br><br>Διακανονισμοί δόσεων γίνονται δεκτοί για ποσά μεγαλύτερα των 100 ευρώ<br>Διακανονισμός με δόσεις μπορεί να δοθεί μόνο μία (1) φορά το χρόνο <br>Διακανονισμός με δόσεις δε μπορεί να γίνει σε συνδρομητές με credit segment P & 0, που είναι ενταγμένοι σε ενεργή (active) Port Out καμπάνια και Medium/ Low που συμμετέχουν στην καμπάνια NBA_PAYMENT_EXTENSION_XXXxx <br>Ο διακανονισμός καταχωρείται  πάντα για το σύνολο του οφειλώμενου ποσού (ληξιπρόθεσμου και μη)<br>Παράλληλα με την καταβολή των δόσεων, οι νέοι λογαριασμοί που εκδίδονται θα πρέπει να εξοφλούνται έως την ημερομηνία λήξης τους<br>Σε περιπτώσεις όπου το ποσό πληρωμής υπερβαίνει τα 500€ ενημερώνω τον συνδρομητή ότι η πληρωμή δεν μπορεί να γίνει με μετρητά<br>Στην περίπτωση συνδρομητών με Δόσεις Συσκευής στο λογαριασμό ενημερώνουμε ότι δεν είναι εφικτός διακανονισμός με δόσεις καθώς η οφειλή περιλαμβάνει ήδη δόσεις και προτείνουμε εναλλακτικά να κάνει πληρωμή με πιστωτική κάρτα και να βάλει τις δόσεις στην τράπεζα άτοκα",position:1});  
        // ArrangementPaymentListActions.push({category:"Ultra High Value",coded_category:"Ultra_High_Value",third_panel_existance:true,action:"<b>Siebel κινητής</b><br><br>1. Ενεργοποιώ φραγής, Περιαγωγής (BRR), Διεθνών Κλήσεων (BRI), Εξερχομένων κλήσεων προς αριθμούς υψηλής χρέωσης(BPRV)<br>2. Συμπληρώνω SR (σε επίπεδο μητρώου) : <br>Type: Θέματα Εισπράξεων<br>Category: Διακανονισμός Οφειλής<br>Subcategory: Διακανονισμός με Δόσεις<br>Comments: Άνεργος/Οικονομική δυσχέρεια και το λεκτικό από το πεδίο Λεκτικό SR του Εργαλείου Διακανονισμών<br>Στο Dynamic Applet 'Θέματα Εισπράξεων', στο πεδίο Στοιχεία Διακανονισμού συμπληρώνω την ημερομηνία πληρωμής της 1ης δόσης (μόνο)<br>Ctrl +S , Auto Assign και τέλος κάνω Closed το SR<<br><strong>Σημείωση</strong><br>Επιλέγοντας Auto Assign εμφανίζεται popup μήνυμα που αναφέρει: <i>'Επιβεβαιώστε ότι το αίτημα έχει ολοκληρωθεί σε πρώτο χρόνο και επιλέξτε status Closed'</i>.<br>Το συγκεκριμένο μήνυμα θα πρέπει να αγνοείται σε περίπτωση καταχώρησης διακανονισμού σε δόσεις, πατώντας το ΟΚ<br>3. Ενημερώνω το συνδρομητή πως μόλις εξοφλήσει την 1η δόση θα πρέπει να μας καλέσει εκ νέου. Αν πριν την καταβολή της 1ης  δόσης ο συνδρομητής είχε φραγή, μόλις την καταβάλει θα μπορεί να γίνει άρση της φραγής.<br><br><b>Siebel σταθερής:</b><br><br>1. Συμπληρώνω smartscript SR:<br>Περιοχή: Λογαριασμοί & Χρεώσεις <br>Υπο-περιοχή: Διακανονισμός με δόσεις<br>Αποτέλεσμα κλήσης: Εκκρεμεί έλεγχος / Ενημέρωση<br>Θέμα: Διακανονισμός με δόσεις για ανέργους και οικονομική δυσχέρεια<br>Λεπτομερής Περιγραφή: Κάνω Copy το λεκτικό του SR<br>Τμήμα: Credit Control<br>2. Ενημερώνω το συνδρομητή πως μόλις εξοφλήσει την 1η δόση θα πρέπει να μας καλέσει εκ νέου. Αν πριν την καταβολή της 1ης  δόσης ο συνδρομητής είχε φραγή, μόλις την καταβάλει θα μπορεί να γίνει άρση της φραγής. <br><br><b>Δεν ξεχνώ:</b><br><br>Διακανονισμοί δόσεων γίνονται δεκτοί για ποσά μεγαλύτερα των 100 ευρώ<br>Διακανονισμός με δόσεις μπορεί να δοθεί μόνο μία (1) φορά το χρόνο <br>Διακανονισμός με δόσεις δε μπορεί να γίνει σε συνδρομητές με credit segment P & 0, που είναι ενταγμένοι σε ενεργή (active) Port Out καμπάνια και Medium/ Low που συμμετέχουν στην καμπάνια NBA_PAYMENT_EXTENSION_XXXxx <br>Ο διακανονισμός καταχωρείται πάντα για το σύνολο του οφειλώμενου ποσού (ληξιπρόθεσμου και μη)<br>Παράλληλα με την καταβολή των δόσεων, οι νέοι λογαριασμοί που εκδίδονται θα πρέπει να εξοφλούνται έως την ημερομηνία λήξης τους<br>Σε περιπτώσεις όπου το ποσό πληρωμής υπερβαίνει τα 500€ ενημερώνω τον συνδρομητή ότι η πληρωμή δεν μπορεί να γίνει με μετρητά<br>Στην περίπτωση συνδρομητών με Δόσεις Συσκευής στο λογαριασμό ενημερώνουμε ότι δεν είναι εφικτός διακανονισμός με δόσεις καθώς η οφειλή περιλαμβάνει ήδη δόσεις και προτείνουμε εναλλακτικά να κάνει πληρωμή με πιστωτική κάρτα και να βάλει τις δόσεις στην τράπεζα άτοκα",position:1}); 
        // ArrangementPaymentListActions.push({category:"SAM",coded_category:"SAM",third_panel_existance:true,action:"<b>Siebel κινητής</b><br><br>1. Ενεργοποιώ φραγής, Περιαγωγής (BRR), Διεθνών Κλήσεων (BRI), Εξερχομένων κλήσεων προς αριθμούς υψηλής χρέωσης(BPRV)<br>2. Συμπληρώνω SR (σε επίπεδο μητρώου) : <br>Type: Θέματα Εισπράξεων<br>Category: Διακανονισμός Οφειλής<br>Subcategory: Διακανονισμός με Δόσεις<br>Comments: Άνεργος/Οικονομική δυσχέρεια και το λεκτικό από το πεδίο Λεκτικό SR του Εργαλείου Διακανονισμών<br>Στο Dynamic Applet 'Θέματα Εισπράξεων', στο πεδίο Στοιχεία Διακανονισμού συμπληρώνω την ημερομηνία πληρωμής της 1ης δόσης (μόνο)<br>Ctrl +S , Auto Assign και τέλος κάνω Closed το SR<<br><strong>Σημείωση</strong><br>Επιλέγοντας Auto Assign εμφανίζεται popup μήνυμα που αναφέρει: <i>'Επιβεβαιώστε ότι το αίτημα έχει ολοκληρωθεί σε πρώτο χρόνο και επιλέξτε status Closed'</i>.<br>Το συγκεκριμένο μήνυμα θα πρέπει να αγνοείται σε περίπτωση καταχώρησης διακανονισμού σε δόσεις, πατώντας το ΟΚ<br>3. Ενημερώνω το συνδρομητή πως μόλις εξοφλήσει την 1η δόση θα πρέπει να μας καλέσει εκ νέου. Αν πριν την καταβολή της 1ης  δόσης ο συνδρομητής είχε φραγή, μόλις την καταβάλει θα μπορεί να γίνει άρση της φραγής.<br><br><b>Siebel σταθερής:</b><br><br>1. Συμπληρώνω smartscript SR:<br>Περιοχή: Λογαριασμοί & Χρεώσεις <br>Υπο-περιοχή: Διακανονισμός με δόσεις<br>Αποτέλεσμα κλήσης: Εκκρεμεί έλεγχος / Ενημέρωση<br>Θέμα: Διακανονισμός με δόσεις για ανέργους και οικονομική δυσχέρεια<br>Λεπτομερής Περιγραφή: Κάνω Copy το λεκτικό του SR<br>Τμήμα: Credit Control<br>2. Ενημερώνω το συνδρομητή πως μόλις εξοφλήσει την 1η δόση θα πρέπει να μας καλέσει εκ νέου. Αν πριν την καταβολή της 1ης  δόσης ο συνδρομητής είχε φραγή, μόλις την καταβάλει θα μπορεί να γίνει άρση της φραγής. <br><br><b>Δεν ξεχνώ:</b><br><br>Διακανονισμοί δόσεων γίνονται δεκτοί για ποσά μεγαλύτερα των 100 ευρώ.<br>Διακανονισμός με δόσεις μπορεί να δοθεί μόνο μία (1) φορά το χρόνο <br>Διακανονισμός με δόσεις δε μπορεί να γίνει σε συνδρομητές με credit segment P & 0, που είναι ενταγμένοι σε ενεργή (active) Port Out καμπάνια και Medium/ Low που συμμετέχουν στην καμπάνια NBA_PAYMENT_EXTENSION_XXXxx <br>Ο διακανονισμός καταχωρείται πάντα για το σύνολο του οφειλώμενου ποσού (ληξιπρόθεσμου και μη)<br>Παράλληλα με την καταβολή των δόσεων, οι νέοι λογαριασμοί που εκδίδονται θα πρέπει να εξοφλούνται έως την ημερομηνία λήξης τους<br>Σε περιπτώσεις όπου το ποσό πληρωμής υπερβαίνει τα 500€ ενημερώνω τον συνδρομητή ότι η πληρωμή δεν μπορεί να γίνει με μετρητά<br>Στην περίπτωση συνδρομητών με Δόσεις Συσκευής στο λογαριασμό ενημερώνουμε ότι δεν είναι εφικτός διακανονισμός με δόσεις καθώς η οφειλή περιλαμβάνει ήδη δόσεις και προτείνουμε εναλλακτικά να κάνει πληρωμή με πιστωτική κάρτα και να βάλει τις δόσεις στην τράπεζα άτοκα",position:1}); 
        // ArrangementPaymentListActions.push({category:"SoHo",coded_category:"SoHo",third_panel_existance:true,action:"<b>Siebel κινητής:</b><br><br>1. Συμπληρώνω SR (σε επίπεδο μητρώου) : <br>Type: Θέματα Εισπράξεων<br>Category: Διακανονισμός Οφειλής<br>Subcategory: Διακανονισμός με Δόσεις<br>Comments: Άνεργος/Οικονομική δυσχέρεια και το λεκτικό από το πεδίο Λεκτικό SR του Εργαλείου Διακανονισμών<br>Στο Dynamic Applet 'Θέματα Εισπράξεων', στο πεδίο Στοιχεία Διακανονισμού συμπληρώνω την ημερομηνία πληρωμής της 1ης δόσης (μόνο)<br>Ctrl +S και Auto Assign και στη συνέχεια αλλάζω το status σε Closed<br>2. Ενημερώνω το συνδρομητή πως μόλις εξοφλήσει την 1η δόση θα πρέπει να μας καλέσει εκ νέου. Αν πριν την καταβολή της 1ης  δόσης ο συνδρομητής είχε φραγή, μόλις την καταβάλει θα μπορεί να γίνει άρση της φραγής.<br><br><b>Siebel σταθερής: </b><br><br>1. Συμπληρώνω smartscript SR: <br>Περιοχή: Λογαριασμοί & Χρεώσεις <br>Υπο-περιοχή: Διακανονισμός με δόσεις<br>Αποτέλεσμα κλήσης: Εκκρεμεί έλεγχος / Ενημέρωση<br>Θέμα: Διακανονισμός με δόσεις για ανέργους και οικονομική δυσχέρεια<br>Λεπτομερής Περιγραφή: Κάνω Copy το λεκτικό του SR<br>Τμήμα: Credit Control<br>2. Ενημερώνω το συνδρομητή πως μόλις εξοφλήσει την 1η δόση θα πρέπει να μας καλέσει εκ νέου. Αν πριν την καταβολή της 1ης  δόσης ο συνδρομητής είχε φραγή, μόλις την καταβάλει θα μπορεί να γίνει άρση της φραγής .<br><br><b>Δεν ξεχνώ:</b><br><br>Διακανονισμοί δόσεων γίνονται δεκτοί για ποσά μεγαλύτερα των 100 ευρώ.<br>Παράλληλα με την καταβολή των δόσεων, οι νέοι λογαριασμοί που εκδίδονται θα πρέπει να εξοφλούνται έως την ημερομηνία λήξης τους<br>Σε περιπτώσεις όπου το ποσό πληρωμής υπερβαίνει τα 500€ ενημερώνω τον συνδρομητή ότι η πληρωμή δεν μπορεί να γίνει με μετρητά<br>Στην περίπτωση συνδρομητών με Δόσεις Συσκευής στο λογαριασμό ενημερώνουμε ότι δεν είναι εφικτός διακανονισμός με δόσεις καθώς η οφειλή περιλαμβάνει ήδη δόσεις και προτείνουμε εναλλακτικά να κάνει πληρωμή με πιστωτική κάρτα και να βάλει τις δόσεις στην τράπεζα άτοκα",position:1}); 
        ArrangementPaymentListActions.push({category:"Κινητή",coded_category:"Κινητή",third_panel_existance:true,action:"<b>Siebel κινητής:</b><br><br>1. Συμπληρώνω SR (σε επίπεδο μητρώου) : <br>Type: Θέματα Εισπράξεων<br>Category: Διακανονισμός Οφειλής<br>Subcategory: Διακανονισμός με Δόσεις<br>Comments: Άνεργος/Οικονομική δυσχέρεια και το λεκτικό από το πεδίο Λεκτικό SR του Εργαλείου Διακανονισμών<br>Στο Dynamic Applet 'Θέματα Εισπράξεων', στο πεδίο Στοιχεία Διακανονισμού συμπληρώνω την ημερομηνία πληρωμής της 1ης δόσης (μόνο)<br>Ctrl +S και Auto Assign και στη συνέχεια αλλάζω το status σε Closed<br>2. Ενημερώνω το συνδρομητή πως μόλις εξοφλήσει την 1η δόση θα πρέπει να μας καλέσει εκ νέου. Αν πριν την καταβολή της 1ης  δόσης ο συνδρομητής είχε φραγή, μόλις την καταβάλει θα μπορεί να γίνει άρση της φραγής.<br><br><b>Siebel σταθερής: </b><br><br>1. Συμπληρώνω smartscript SR: <br>Περιοχή: Λογαριασμοί & Χρεώσεις <br>Υπο-περιοχή: Διακανονισμός με δόσεις<br>Αποτέλεσμα κλήσης: Εκκρεμεί έλεγχος / Ενημέρωση<br>Θέμα: Διακανονισμός με δόσεις για ανέργους και οικονομική δυσχέρεια<br>Λεπτομερής Περιγραφή: Κάνω Copy το λεκτικό του SR<br>Τμήμα: Credit Control<br>2. Ενημερώνω το συνδρομητή πως μόλις εξοφλήσει την 1η δόση θα πρέπει να μας καλέσει εκ νέου. Αν πριν την καταβολή της 1ης  δόσης ο συνδρομητής είχε φραγή, μόλις την καταβάλει θα μπορεί να γίνει άρση της φραγής .<br><br><b>Δεν ξεχνώ:</b><br><br>Διακανονισμοί δόσεων γίνονται δεκτοί για ποσά μεγαλύτερα των 100 ευρώ.<br>Παράλληλα με την καταβολή των δόσεων, οι νέοι λογαριασμοί που εκδίδονται θα πρέπει να εξοφλούνται έως την ημερομηνία λήξης τους<br>Σε περιπτώσεις όπου το ποσό πληρωμής υπερβαίνει τα 500€ ενημερώνω τον συνδρομητή ότι η πληρωμή δεν μπορεί να γίνει με μετρητά<br>Στην περίπτωση συνδρομητών με Δόσεις Συσκευής στο λογαριασμό ενημερώνουμε ότι δεν είναι εφικτός διακανονισμός με δόσεις καθώς η οφειλή περιλαμβάνει ήδη δόσεις και προτείνουμε εναλλακτικά να κάνει πληρωμή με πιστωτική κάρτα και να βάλει τις δόσεις στην τράπεζα άτοκα",position:1}); 
        ArrangementPaymentListActions.push({category:"Σταθερή",coded_category:"Σταθερή",third_panel_existance:true,action:"<b>Siebel κινητής:</b><br><br>1. Συμπληρώνω SR (σε επίπεδο μητρώου) : <br>Type: Θέματα Εισπράξεων<br>Category: Διακανονισμός Οφειλής<br>Subcategory: Διακανονισμός με Δόσεις<br>Comments: Άνεργος/Οικονομική δυσχέρεια και το λεκτικό από το πεδίο Λεκτικό SR του Εργαλείου Διακανονισμών<br>Στο Dynamic Applet 'Θέματα Εισπράξεων', στο πεδίο Στοιχεία Διακανονισμού συμπληρώνω την ημερομηνία πληρωμής της 1ης δόσης (μόνο)<br>Ctrl +S και Auto Assign και στη συνέχεια αλλάζω το status σε Closed<br>2. Ενημερώνω το συνδρομητή πως μόλις εξοφλήσει την 1η δόση θα πρέπει να μας καλέσει εκ νέου. Αν πριν την καταβολή της 1ης  δόσης ο συνδρομητής είχε φραγή, μόλις την καταβάλει θα μπορεί να γίνει άρση της φραγής.<br><br><b>Siebel σταθερής: </b><br><br>1. Συμπληρώνω smartscript SR: <br>Περιοχή: Λογαριασμοί & Χρεώσεις <br>Υπο-περιοχή: Διακανονισμός με δόσεις<br>Αποτέλεσμα κλήσης: Εκκρεμεί έλεγχος / Ενημέρωση<br>Θέμα: Διακανονισμός με δόσεις για ανέργους και οικονομική δυσχέρεια<br>Λεπτομερής Περιγραφή: Κάνω Copy το λεκτικό του SR<br>Τμήμα: Credit Control<br>2. Ενημερώνω το συνδρομητή πως μόλις εξοφλήσει την 1η δόση θα πρέπει να μας καλέσει εκ νέου. Αν πριν την καταβολή της 1ης  δόσης ο συνδρομητής είχε φραγή, μόλις την καταβάλει θα μπορεί να γίνει άρση της φραγής .<br><br><b>Δεν ξεχνώ:</b><br><br>Διακανονισμοί δόσεων γίνονται δεκτοί για ποσά μεγαλύτερα των 100 ευρώ.<br>Παράλληλα με την καταβολή των δόσεων, οι νέοι λογαριασμοί που εκδίδονται θα πρέπει να εξοφλούνται έως την ημερομηνία λήξης τους<br>Σε περιπτώσεις όπου το ποσό πληρωμής υπερβαίνει τα 500€ ενημερώνω τον συνδρομητή ότι η πληρωμή δεν μπορεί να γίνει με μετρητά<br>Στην περίπτωση συνδρομητών με Δόσεις Συσκευής στο λογαριασμό ενημερώνουμε ότι δεν είναι εφικτός διακανονισμός με δόσεις καθώς η οφειλή περιλαμβάνει ήδη δόσεις και προτείνουμε εναλλακτικά να κάνει πληρωμή με πιστωτική κάρτα και να βάλει τις δόσεις στην τράπεζα άτοκα",position:1}); 
 
        ArrangementSMSList.push({category:"Diakanonismos",text1:"Αγαπητε Συνδρομητή, με βάση το αρχικό ποσό οφειλής αξίας ", 
                                 text2:" ευρώ για τον αριθμό: ",text3:",θα προχωρήσουμε σε διακανονισμό και έτσι μπορείτε να αποπληρώσετε το ποσό σε " ,text4:" αξίας " , text5:" ευρώ έκαστως!"}); 
         
         
    } 
             
         
       function SetUpUpperCategories() 
        { 
            //UpperList.collection.sort(clasif_sort_asc); 
            //UpperList.disconnection_legal.sort(clasif_sort_asc); 
            //UpperList.high_spend.sort(clasif_sort_asc); 
            //UpperList.high_usase.sort(clasif_sort_asc); 
            //UpperList.welcome_calls.sort(clasif_sort_asc); 
            
             var test = "aaaa"; 
             jQ112.each(UpperList, function(j) { 
                
                    tempButtons[j] =""; // αρχικοποίηση το πίνακα 
                }); 
                     
             
            jQ112.each(UpperList, function(j) { 
                    //tempButtons[j] += '<button type = "button" name="' + UpperList[j].greatcategory + '"' + 'class = "mcalc-button-darkgrey"' +  'onclick = " open_second_menu(\'' + UpperList[j].greatcategory + '\'); " >' + UpperList[j].greatcategory  + '</button>'; 
					tempButtons[j] += '<button type = "button" name="' + UpperList[j].greatcategory + '"' + 'class = "mcalc-button-darkgrey"' +  'onclick = "open_third_menu(\'' + UpperList[j].greatcategory + '\'); " >' + UpperList[j].greatcategory  + '</button>'; 
					
        }); 
             
            var temp = '<button type = "button" name=""' + 'class = "resetbtn"' +  'onclick = "resetFunction()" >' + 'Reset'  + '</button>'; 
            tempButtons[tempButtons.length-1] += temp; 
                    
            jQ112("#first_menu_div").html(tempButtons); 
        } 
     
     
     
     
    function SetUpInnerCollectionCategories() 
    { 
        jQ112.each(InnerList, function(j) { 
                    tempInnerButtons[j] =""; // αρχικοποίηση το πίνακα      
            }); 
                     
            jQ112.each(InnerList, function(j) { 
                    tempInnerButtons[j] += '<button type = "button" name="' + InnerList[j].category + '"' + 'class = "mcalc-button-darkgrey"' + 'onclick = "open_third_menu(\'' + InnerList[j].category + '\'); " >' + InnerList[j].category  + '</button>';                
                }); 
                         

            jQ112("#second_menu_div").html(tempInnerButtons); 
         
    } 
     
    function SetUpThirdLevelCollectionCategories(innercategory)  // Theli ftiaksimo --------------------------------------------------------- 
    { 
         
              jQ112.each(ThirdLevelList, function(j) { 
                tempThirdLevelButtons[j] =""; // αρχικοποίηση το πίνακα       
              }); 
            var i = 0;  
            jQ112.each(ThirdLevelList, function(j) { 
                  
                        if(innercategory == ThirdLevelList[j].category) // Αν η κατηγορία ταυτίζεται με αυτή που καλέστηκε τότε εμφάνισε τα 2 κουμπιά  της κατηγορίας 
                           {  
                                tempThirdLevelButtons[i] += '<button type = "button" name="' + ThirdLevelList[j].child + '"' + 'class = "mcalc-button-darkgrey"' + 'onclick = "open_main_menu(\'' + ThirdLevelList[j].child +"\',\'" + ThirdLevelList[j].category + '\'); " >' + ThirdLevelList[j].child  + '</button>';   
                                i++; 
                           }                  
        }); 
        i=0; 
            
            jQ112("#third_menu_div").html(tempThirdLevelButtons); 
         
    } 
         
     
    function open_second_menu(category) 
        { 
             
            jQ112("#second_menu_div").hide(500); 
            jQ112("#third_menu_div").hide(500); 
            jQ112(".main_menu_div").hide(500); // Στην περίπτωση που έχει μέινει ανοιχτο απο πριν , κλέινουμε το main_menu() 
             
            if (category == "Collection")// στην θέση του second menu εμφάνισε τα segments 
                { 
                    jQ112("#second_menu_div").hide(200); 
                    RetrieveCollectionCategories(); 
                    SetUpInnerCollectionCategories(); 
                    jQ112("#second_menu_div").show(500); 

                } 
            else  
                { 
                    jQ112("#third_menu_div").hide(500); 
                    jQ112("#second_menu_div").hide(500); 
                    jQ112("#second_menu_div").show(500); 
                    var content = "<div class='header_title_div'>Διαδικασία</div>";
                    jQ112.each(UpperList, function(i) { 
                        if(category == UpperList[i].greatcategory) 
                            { 
                                content += UpperList[i].procedure;
                                jQ112("#second_menu_div").html(content); 
                            } 
                    }); 
                     
                } 
             
        } 
             
        function open_third_menu(innercategory) 
        { 
            globalcategory = innercategory ; 
            if(innercategory == "No Segmentation/ Bad Payer") 
                { 
                    jQ112(".main_menu_div").hide(500); 
                    jQ112("#third_menu_div").hide(500); 
                    jQ112("#third_menu_div").show(500);
                    var content = "<div class='header_title_div'>Διαδικασία</div>";
                    jQ112.each(InnerList, function(i) { 
                     if(innercategory == InnerList[i].category) 
                            {                                
                                content +=InnerList[i].procedure;
                                jQ112("#third_menu_div").html(content); 
                            } 
                    }); 
                     
                } 
            else 
                { 
                     jQ112("#third_menu_div").hide(500); 
                     jQ112(".main_menu_div").hide(500); 
                     //πρέπει να χτίσουμε το φτιάξιμο του τρίτου panel με τις 2 επιλογές  (παραταση εξόφλησης - διακανονισμος δοσεων) 
                     RetrieveThirdLevelCollectionCategories(); 
                     SetUpThirdLevelCollectionCategories(innercategory); 
                     jQ112("#third_menu_div").show(500); 
                }  
        } 
         
        function open_main_menu(option,segment) 
        { 
            // Αρχικά αρχικοποιούμε οποιοδήποτε παλιό περιεχόμενο του main menu ,ΘΕΛΕΙ ΦΤΙΑΞΙΜΟ 
            InitializeMainMenu(option); 
            globalsegment = segment; 
            globaloption = option; 
            if (globalsegment == 'Κινητή') {
                jQ112("#connection_type_sms_mobile").prop('checked', true); 
                jQ112("#connection_type_sms_fixed").prop('checked', false); 
            }
            if (globalsegment == 'Σταθερή') {
                jQ112("#connection_type_sms_mobile").prop('checked', false); 
                jQ112("#connection_type_sms_fixed").prop('checked', true); 
            }
            
            jQ112(".main_menu_div").hide(100); 

            user_option = option; 
            user_segment = segment; 
            var elegxoi = "Ελεγχοι:"; 
            if(option == "Παράταση εξόφλησης") 
                { 
                    //Θα φτιάξουμε το div των ελέγχων 
                    
                     
                    jQ112("#titlos_div").html("Παράταση (Υπολογισμός ημερών)"); 
                    elegxoi = ""; //Recycle 
                     
                     
                    //Div Ελέγχων 
                    jQ112.each(ExtentionPaymentListChecks, function(i) {   
                        if(ExtentionPaymentListChecks[i].category == segment) 
                            { 
                                 elegxoi += '<br>' + ExtentionPaymentListChecks[i].check; 
                            } 
                     
                    });  
                    
                         jQ112(".main_menu_div").show(500, function() {  
                            jQ112("#checkings_div_inner").html(elegxoi);
                            jQ112("#checkings_div_inner").css("display","block");
                            jQ112("#checkings_div_outer").show(); 
                        }); 
                             
                         
                } 
            else  //Διακανονισμος , Θα τραβήξουμε την λίστα με τους διακανονισμούς για κάθε segment 
                { 
                    jQ112("#titlos_div").html("Υπολογισμός δόσεων"); 
                    jQ112(".diakanonismoi_div").css("display","block"); 
                    jQ112("#diakanonismoi_table").css("display","block"); 
                  //</br></br>  jQ112("#tipos_gramis_sms").css("display","block"); 
                    
                    var firstvalue= jQ112("#plithos_doseon").first().val();  // το φτιάχνω Αργότερα , για να εμφανίζουμε το πρώτο option κάθε φορά που φορτώνει 

jQ112('#poso_diakanonismou').unbind(); 
                    jQ112('#poso_diakanonismou').change(function()  {    // Δηλώνουμε event στο select button 
                        if(jQ112( "#plithos_doseon option:selected" ).val()!= "1") 
                           { 
                                ResultAcceptance(option,segment,null,null); 
                           } 
                    }); 
                    jQ112('#poso_diakanonismou').unbind(); 
                    jQ112('#plithos_doseon').on("change",function()  {    // Δηλώνουμε event στο select button 
                               ResultAcceptance(option,segment,null,null);                     
                    }); 
                     
                    //jQ112('input[name=clicheck]').on("click",function()  {    // Δηλώνουμε event στο select button 
                               //(option,segment,null,null);                     
                    //}); 
                     
                     
                    elegxoi = ""; //Recycle 
                     
                    jQ112.each(ArrangementPaymentListChecks, function(i) { 
                         
                         
                        if(ArrangementPaymentListChecks[i].category == segment) 
                            { 
                                 elegxoi += '<br>' + ArrangementPaymentListChecks[i].check; 
                            } 
                     
                    }); 
                     
                    jQ112(".main_menu_div").show(500, function() { 
                        jQ112("#checkings_div_inner").html(elegxoi);
                        jQ112("#checkings_div_inner").css("display","block");
                        jQ112("#checkings_div_outer").show(); 
                        }); 
                     
                     
                } 
          
        } 
     
         
     
        function InitializeMainMenu(option) 
        { 
            if (option == "Παράταση εξόφλησης") 
                { 
                    //Αρχικά μηδενίζουμε τα πεδία των ημερομηνιών και ημερών 
                    jQ112("#cal_text").val(''); 
                    jQ112("#cal_text2").val(''); 
                    dateObject1 = "";  //κάνουμε Reset ώστε να μην τρέξει  τους ελέγχους στο ResultAcceptance 
                    dateObject2 = "";  //κάνουμε Reset ώστε να μην τρέξει  τους ελέγχους στο ResultAcceptance 
                    jQ112("#inner_days_div").empty(); 
                    jQ112("#inner_result_div").empty(); // Διαγράφουμε τυχόν προηγούμενες εικόνες                      
                } 
            else 
                { 
                    // Αρχικά μηδενίζουμε ποσά , αρχικοποιούμε πεδία και μετά κρύβουμε τον sms_tool 
                    jQ112("#cal_text").val(''); 
                    jQ112("#cal_text2").val(''); 
                    jQ112("#poso_diakanonismou").val(''); 
                    jQ112("#plithos_doseon").val(jQ112("#plithos_doseon option:first").val()); 
                    jQ112("#subscriber-number").empty(); 
                    jQ112("#subscriber-cli").empty(); 
                    //jQ112("#clicheck").prop( "checked", false ); 
                    jQ112("#subscriber-cli").prop('disabled', true); 
                     
                } 
            acceptance_status = false; 
            hideMainMenuFields(option); 
        } 
     
        function hideMainMenuFields(option) 
        { 
            if (option == "Παράταση εξόφλησης") 
                { 
                    //Στην συνέχεια τα κρύβουμε 
                    jQ112("#days_acceptance_div").show(); 
                    jQ112(".cal_div").show(); 
                    jQ112(".diakanonismoi_div").hide(); 
                    jQ112("#outer_days_div").show(); 
                    // jQ112("#outer_result_div").show();  // Αλλαγή: Έχει γίνει πλέον από το css: always hidden 
                    jQ112("#outer_sms_tool_div").css("display" ,"none"); // κρύβουμε το sms tool 
                    jQ112("#lektikoSR_div").css("display" ,"none"); 
                //</br></br>    jQ112("#tipos_gramis_sms").css("display","none");  always hidden 
                  //</br></br>  jQ112("#actions_div").hide();  always hidden 
                } 
            else  // Διακανονισμοί 
            { 
                    jQ112(".cal_div").hide();  // κρύβουμε το div του ημερολογίου 
                    jQ112("#days_acceptance_div").hide(); 
                    jQ112("#outer_days_div").hide(); 
                    //jQ112("#outer_result_div").hide();   //// Αλλαγή: Έχει γίνει πλέον από το css: always hidden
                    jQ112("#outer_sms_tool_div").css("display" ,"none"); // κρύβουμε το sms tool 
                    jQ112("#lektikoSR_div").css("display" ,"none"); 
                 //</br></br>   jQ112("#actions_div").hide(); 
            } 
        } 
     
    function resetFunction() 
    { 
        //Αρχικά μηδενίζουμε όλα τα πεδία του main menu 
        InitializeMainMenu("Παράταση εξόφλησης"); 
        InitializeMainMenu("Διακανονισμοί Δόσεων"); 
        jQ112(".mcalc-button-darkgrey").css("background-color","#ababab");
        //και στην συνέχεια τα κλείνουμε 
        jQ112(".main_menu_div").hide(500); 
        jQ112("#third_menu_div").hide(500); 
        jQ112("#second_menu_div").hide(500); 
        
        //Μηδενίζουμε τα calendars
        jQ112("#cal_text").val(""); 
        jQ112("#cal_text2").val(""); 
        jQ112("#cal_text3").val(""); 
        jQ112("#cal_text4").val(""); 
        acceptance_status = false; 
    } 
     
         
     
        function getParameterByName(name, url) 
        { 
            if (!url) url = window.location.href; 
            name = name.replace(/[\[\]]/g, "\\$&"); 
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), 
                results = regex.exec(url); 
            if (!results) return null; 
            if (!results[2]) return true; 
            return decodeURIComponent(results[2].replace(/\+/g, " ")); 
        } 
     
        function Open_Sms_Tool(option,segment) 
        { 
             
            var sms_text =""; 
            if(local)//Αν είμαστε σε local έκδοση 
                { 
                       var poso_diakanonismou = jQ112("#poso_diakanonismou").val(); 
                       var plithos_doseon_string = jQ112("#plithos_doseon").val(); 
                     
                       final_dose = getMonthlybill(poso_diakanonismou , plithos_doseon_string); 
                       jQ112.each(ArrangementSMSList, function(i) { 

                            sms_text = ArrangementSMSList[i].text1 + jQ112("#poso_diakanonismou").val() + ArrangementSMSList[i].text2 + 
                                jQ112("#subscriber-number").val() + ArrangementSMSList[i].text3 + jQ112("#plithos_doseon option:selected").html() + ArrangementSMSList[i].text4 + final_dose + ArrangementSMSList[i].text5; 
                        }); 
                        jQ112("#sms-body-text").html(sms_text); 
                } 
             

        } 
     
    function getMonthlybill(var1 , var2) 
    { 
        final_dose = Math.round((var1 / var2)*100) /100; 
        return final_dose; 
    } 
       
     
         
             
             
var clasif_sort_asc = function (input1, input2) { 
if (input1.position > input2.position) return 1; 
if (input1.position < input2.position) return -1; 
return 0; 
};          

    function StoreDate() 
    { 
     
        jQ112("#cal_text").prop('disabled', false); 
        user_date1 = document.getElementById("cal_text").value; 
        jQ112("#cal_text").prop('disabled', true); 
         
        jQ112("#cal_text2").prop('disabled', false); 
        user_date2 = document.getElementById("cal_text2").value; 
        jQ112("#cal_text2").prop('disabled', true); 
         
        //var x=  jQ112("#cal_text").val(); 
    } 
     
    function ResultAcceptance(option,segment,udate1,udate2) 
        { 
            var date1 = new Date(udate1); 
            var date2 = new Date(udate2); 
            var energies = ""; 
            var acceptedDays = 0; 
            jQ112("#inner_result_div").empty(); // Διαγράφουμε τυχόν προηγούμενες εικόνες , επειδή ο χρήστης μπορεί να βάλει καινούργια ημερομηνία χωρίς να πατήσει ξανά το main menu 
             
            //Κάνουμε επανάληψη για να βρούμε τα accepted days ανάλογα το segment 
            jQ112.each(ThirdLevelList , function(i){ 
               if(ThirdLevelList[i].category == segment) 
                   { 
                       acceptedDays = parseInt(ThirdLevelList[i].accepted_days); 
                       return false; 
                   } 
            }); 

                    if(option == "Παράταση εξόφλησης") 
                    { 
                        if((udate1 !="") && (udate2!="")) 
                        { 
                            var days = Calculate_days(date1,date2); // Υπολογισμός ημερών 
                        switch(segment)                 // Κανόνας παράτασης ανα segment 
                            {   
                                 case "Medium/Low":  
                                    if(days > acceptedDays) // Ο κανόνας που έχει τεθεί ανα segment 
                                        { 
                                            jQ112("#inner_result_div").append('<img id="resultImg" src="http://infoportal.vodafone.com/CommonFiles/Images/Ebacus2/no.png" width="40px" height="40px" />'); 
                                            acceptance_status =false; 
                                        } 
                                    else 
                                        {                                         
                                            jQ112("#inner_result_div").append('<img id="resultImg" src="http://infoportal.vodafone.com/CommonFiles/Images/Ebacus2/yes.png" width="40px" height="40px" />'); 
                                            acceptance_status =true; 
                                        } 
                                    break; 
                                     
                                case "High Value":  
                                    if(days > acceptedDays) // Ο κανόνας που έχει τεθεί ανα segment 
                                        { 
                                            jQ112("#inner_result_div").append('<img id="resultImg" src="http://infoportal.vodafone.com/CommonFiles/Images/Ebacus2/no.png" width="40px" height="40px" />'); 
                                            acceptance_status =false; 
                                        } 
                                    else 
                                        { 
                                           jQ112("#inner_result_div").append('<img id="resultImg" src="http://infoportal.vodafone.com/CommonFiles/Images/Ebacus2/yes.png" width="40px" height="40px" />'); 
                                            acceptance_status =true; 
                                        } 
                                    break; 
                                     
                                case "Ultra High Value":  
                                    if(days > acceptedDays) // Ο κανόνας που έχει τεθεί ανα segment 
                                        { 
                                            jQ112("#inner_result_div").append('<img id="resultImg" src="http://infoportal.vodafone.com/CommonFiles/Images/Ebacus2/no.png" width="40px" height="40px" />'); 
                                            acceptance_status =false; 
                                        } 
                                    else 
                                        { 
                                            jQ112("#inner_result_div").append('<img id="resultImg" src="http://infoportal.vodafone.com/CommonFiles/Images/Ebacus2/yes.png" width="40px" height="40px" />'); 
                                            acceptance_status =true; 
                                        } 
                                    break; 
                                     
                                case "SAM":  
                                    if(days > acceptedDays) // Ο κανόνας που έχει τεθεί ανα segment 
                                        { 
                                            jQ112("#inner_result_div").append('<img id="resultImg" src="http://infoportal.vodafone.com/CommonFiles/Images/Ebacus2/no.png" width="40px" height="40px" />'); 
                                            acceptance_status =false; 
                                        } 
                                    else 
                                        { 
                                            jQ112("#inner_result_div").append('<img id="resultImg" src="http://infoportal.vodafone.com/CommonFiles/Images/Ebacus2/yes.png" width="40px" height="40px" />'); 
                                            acceptance_status =true; 
                                        } 
                                    break; 
									case "Σταθερή":  // ίδιο με το SAM
                                    if(days > acceptedDays) // Ο κανόνας που έχει τεθεί ανα segment 
                                        { 
                                            jQ112("#inner_result_div").append('<img id="resultImg" src="http://infoportal.vodafone.com/CommonFiles/Images/Ebacus2/no.png" width="40px" height="40px" />'); 
                                            acceptance_status =false; 
                                        } 
                                    else 
                                        { 
                                            jQ112("#inner_result_div").append('<img id="resultImg" src="http://infoportal.vodafone.com/CommonFiles/Images/Ebacus2/yes.png" width="40px" height="40px" />'); 
                                            acceptance_status =true; 
                                        } 
                                    break; 
									case "Κινητή":  // ίδιο με το SAM
                                    if(days > acceptedDays) // Ο κανόνας που έχει τεθεί ανα segment 
                                        { 
                                            jQ112("#inner_result_div").append('<img id="resultImg" src="http://infoportal.vodafone.com/CommonFiles/Images/Ebacus2/no.png" width="40px" height="40px" />'); 
                                            acceptance_status =false; 
                                        } 
                                    else 
                                        { 
                                            jQ112("#inner_result_div").append('<img id="resultImg" src="http://infoportal.vodafone.com/CommonFiles/Images/Ebacus2/yes.png" width="40px" height="40px" />'); 
                                            acceptance_status =true; 
                                        } 
                                    break; 
                                     
                                case "SoHo":  
                                    if(days > acceptedDays) // Ο κανόνας που έχει τεθεί ανα segment 
                                        { 
                                            jQ112("#inner_result_div").append('<img id="resultImg" src="http://infoportal.vodafone.com/CommonFiles/Images/Ebacus2/no.png" width="40px" height="40px" />'); 
                                            acceptance_status =false; 
                                        } 
                                    else 
                                        { 
                                            jQ112("#inner_result_div").append('<img id="resultImg" src="http://infoportal.vodafone.com/CommonFiles/Images/Ebacus2/yes.png" width="40px" height="40px" />'); 
                                            acceptance_status =true; 
                                        } 
                                    break; 
                                default: 
                                    alert("No known segment"); 
                                     
                            } 
                            if(acceptance_status)
                               {
                                    energies = "Ενέργειες:"; 
                                    energies = ""; //Recycle 

                                    //Div Πράξεων 
                                    jQ112.each(ExtentionPaymentListActions, function(i) {   
                                    if(ExtentionPaymentListActions[i].category == segment) 
                                        { 
                                           //Αναλόγως το Acceptance θα έχουμε ή επιτυχία ή αποτυχία 
                                            // Ελέγχουμε αν έχουμε success ή failure 

                                            energies += '<br>' + ExtentionPaymentListActions[i].action; 

                                        } 
                                });  
                                energies += '</ul>'; 
                                jQ112(".main_menu_div").show(500, function() { 
                                jQ112("#actions_div_inner").html(energies); 
                              //</br></br>  jQ112("#actions_div").show(); always hidden 
                                }); 
                            }
                            else // Αν η παράταση δεν είναι αποδεκτή τότε κλείνουμε βγάζουμε alert message και κλείνουμε τα actions αν είναι απο πριν ανοιχτά
                            {
                                //jQ112(this).animate({width :'100px'}, 'slow',function () {
                                //alert("Μη αποδεκτό περιθώριο παράτασης. \nΠαρακαλώ επιλέξτε αποδεκτή ημερομηνία παράτασης.");
                                    //}
                                //);
                            //    jQ112("#actions_div").hide();  always hidden 
                                
                            }
                            
                             
                        } //IF END
                    } 
                    else  // διακανονισμοί δοσεων 
                    { 
                        // Ο διακανονισμός θα πρέπει να ανοίγει και το lektikoSRdiv 
                        var poso = jQ112("#poso_diakanonismou").val(); 
                        var arithmos_doseon = jQ112( "#plithos_doseon option:selected" ).val(); 
                        if(checkNumber(poso) && (poso!= "") && (arithmos_doseon!=1))  // ελέγγουμε τον αριθμό
                           { 
                               dosi_poso_acceptance = true; // Ξεκλειδώνουμε τις δόσεις για κάθε ποσό ,κρατάμε τον κώδικα που τις κλειδώνει για το μέλλον
                               /*dosi_poso_acceptance = false;
                               switch(parseInt(arithmos_doseon))  // cases ανα ποσό οφειλής
                                   {
                                        case 2:
                                           if(poso>=100)
                                            {
                                                   dosi_poso_acceptance =true;
                                            }
                                           else
                                            {
                                                alert("Οι διακανονισμοί 2 δόσεων πραγματοποιούνται για ποσά οφειλής μεγαλύτερα απο 100€");
                                                dosi_poso_acceptance =false;
                                            }
                                           break;
                                        case 3:
                                           if(poso>=200)
                                            {
                                                   dosi_poso_acceptance =true;
                                            }
                                           else
                                            {
                                                alert("Οι διακανονισμοί 3 δόσεων πραγματοποιούνται για ποσά οφειλής μεγαλύτερα απο 200€");
                                                dosi_poso_acceptance =false;
                                            }
                                           break;
                                        case 4:
                                           if(poso>=500)
                                            {
                                                   dosi_poso_acceptance =true;
                                            }
                                           else
                                            {
                                                alert("Οι διακανονισμοί 4 δόσεων πραγματοποιούνται για ποσά οφειλής μεγαλύτερα απο 500€");
                                                dosi_poso_acceptance =false;
                                            }
                                           break;
                                        case 5:
                                           if(poso>=700)
                                            {
                                                   dosi_poso_acceptance =true;
                                            }
                                           else
                                            {
                                                alert("Οι διακανονισμοί 5 δόσεων πραγματοποιούνται για ποσά οφειλής μεγαλύτερα απο 700€");
                                                dosi_poso_acceptance =false;
                                            }
                                           break;
                                        default: 
                                            alert("Μη αποδεκτό value");    
                                   }*/
                               
                               if(dosi_poso_acceptance ==true)  //Μόνο αν είναι αποδεκτό το ποσό και δόση άνοιξε τα νέα πεδία
                                   {
                                       
                                            openLektikoSRDiv(); //Ανοίγουμε το λεκτικό SR Div 
                                            jQ112("#outer_sms_tool_div").css("display","block"); // αν  εισάγει τα δυο πεδία τότε ΑΝΟΙΓΕΙ ΤΟ DIV ΤΟΥ SMS TOOL 
                                            energies = "Ενέργειες:"; 
                                            energies = ""; //Recycle 
                                            //Div Πράξεων 
                                            jQ112.each(ArrangementPaymentListActions, function(i) {   
                                            if(ArrangementPaymentListActions[i].category == segment) 
                                                { 
                                                    // Στο Arrangement πληρωμής θα έχουμε standar actions 
                                                    energies += '<br>' + ArrangementPaymentListActions[i].action;  
                                                } 

                                                });  

                                                jQ112(".main_menu_div").show(500, function() { 
                                                jQ112("#actions_div_inner").html(energies); 
                                             //</br></br>   jQ112("#actions_div").show(); always hidden 
                                                }); 

                                                    //Θα πρέπει να καλούμε την συνάρτηση που ανοίγει το sms tool 
                                                Open_Sms_Tool(option,segment); 
                                                validateMessage(); 
                                   }
                               else
                                   {
                                       closeSmsAndInializeWindow();
                                   }
                                            

                            } 
                            else 
                            {      
                                closeSmsAndInializeWindow();
                            } 
                    } 
        }
    
    function closeSmsAndInializeWindow()
    {
          jQ112("#outer_sms_tool_div").css("display" ,"none"); // κρύβουμε το sms tool 
          jQ112("#lektikoSR_div").css("display","none"); // κρύβουμε το Div του λεκτικού SR 
       //</br></br>   jQ112("#actions_div").css("display","none"); // κρύβουμε το Div των ενεργειών  always hidden 
    }
    
    function clearDateFields() // Κλείνουμε τα date πεδία
    {
        jQ112("#inner_days_div").empty();
        jQ112("#inner_result_div").empty();
       //</br></br> jQ112("#actions_div").hide(); always hidden 
    }
     
    function checkNumber(poso) 
    { 
        if(poso.indexOf(",")) 
        { 
                poso = poso.replace(new RegExp(',', 'gi'), '.'); 
                jQ112("#poso_diakanonismou").val(poso); 
        } 
        var regex=/^\$?\d+(\.\d{2})?$/; 
        if (!poso.match(regex)) 
        { 
            alert("Παρακαλώ εισάγετε αριθμητικό ποσό διακανονισμού.");
            return false; 
        } 
        else 
        {
            if(poso>1)
                {
                    /*if(poso<100)//κάνουμε έναν extra έλεγχο αν δεν είναι SoHo τότε για ποσά μικρότερα απο 100 ευρώ δεν κάνουμε διακανονισμό
                    {  
                        if(globalsegment == "SoHo")
                           {
                                return true;
                           }
                        else
                            {
                                alert("Δεν δίνεται δυνατότητα διακανονισμού για ποσά μικρότερα απο 100 ευρώ.")
                                return false;   
                            }
                     
                    }*/
                    
                    return true;
                }
            else
                {
                    alert("Παρακαλώ εισάγετε συμβατό ποσό διακανονισμού"); 
                    return false;
                }
            
        } 
    } 
    
function fillLektiko(dates,poso_diakanonismou,final_dose,plithos_doseon_value)
{
    lektiko_string = "";
    jQ112("#lektiko_box").val(''); // Recycle;
    jQ112("#cal_text3").val(""); 
    jQ112("#cal_text4").val(""); 
    
    if(globaloption != "Collector Reminder")
       {
        jQ112("#lektiko_box").val('');
        lektiko_string = "Σύνολο Οφειλών μαζί με τον τρέχων λογαριασμό:" + poso_diakanonismou+ " ευρώ" + "\n" ;
             if(plithos_doseon_value == 2)
            {
                lektiko_string += "1η καταβολή έως " + dates[1] + " για το ποσό των " + final_dose + " ευρώ" + "\n" +
                    "2η καταβολή έως " + dates[2] + " για το ποσό των " + final_dose + " ευρώ" + "\n" ;
            }
        else if(plithos_doseon_value == 3)
            {
                 lektiko_string += "1η καταβολή έως " + dates[1] + " για το ποσό των " + final_dose + " ευρώ" + "\n" +
                     "2η καταβολή έως " + dates[2] + " για το ποσό των " + final_dose + " ευρώ" + "\n" 
                     + "3η καταβολή έως " + dates[3] + " για το ποσό των " + final_dose + " ευρώ" + "\n";
            }
           else if(plithos_doseon_value == 4)
            {
                 lektiko_string += "1η καταβολή έως " + dates[1] + " για το ποσό των " + final_dose + " ευρώ" + "\n" +
                     "2η καταβολή έως " + dates[2] + " για το ποσό των " + final_dose + " ευρώ" + "\n" 
                     + "3η καταβολή έως " + dates[3] + " για το ποσό των " + final_dose + " ευρώ" + "\n" 
                     + "4η καταβολή έως " + dates[4] + " για το ποσό των " + final_dose + " ευρώ" + "\n";
            }
        else //5
            {
                lektiko_string += "1η καταβολή έως " + dates[1] + " για το ποσό των " + final_dose + " ευρώ" + "\n" 
                    +"2η καταβολή έως " + dates[2] + " για το ποσό των " + final_dose + " ευρώ" + "\n" +
                    "3η καταβολή έως " + dates[3] + " για το ποσό των " + final_dose + " ευρώ" + "\n" +
                    "4η καταβολή έως " + dates[4] + " για το ποσό των " + final_dose + " ευρώ" + "\n" +
                    "5η καταβολή έως " + dates[5] + " για το ποσό των " + final_dose + " ευρώ" + "\n"; 
            }

    //</br></br>    if((globalsegment != "SoHo")&&((jQ112("input[name='connection_type_sms']:checked").val()) == "mobile"))
    if (globalcategory == "Κινητή")
            {

                lektiko_string += "Ενημερώθηκε για ενεργοποίηση BRI - BRR – BPRV.\n";
            }
           
           lektiko_string += "Οι νέοι λογαριασμοί που θα εκδίδονται θα πρέπει να εξοφλούνται με βάση την ημερομηνία λήξης τους.\n";
       }
   
   
    jQ112("#lektiko_box").val(lektiko_string);
	

}
    
   function secondStepFillLektiko()
    {
        // Ρίχνουμε τις ημερομηνίες των λογαριασμών
        if((jQ112("#cal_text3").val()!="")&&(jQ112("#cal_text4").val()!=""))  //Αν είναι γεμισμένα και τα 2 dates
        {
                var temp_lektiko_string = "";
                jQ112("#lektiko_box").val("");
                temp_lektiko_string += lektiko_string;
            
                temp_lektiko_string += "Ο πρώτος λογαριασμός εκδόθηκε στις " + jQ112("#cal_text3").val() +  ". \n"  +"Ο τελευταίος λογαριασμός εκδόθηκε στις " + jQ112("#cal_text4").val() +  ".\n" ;
                 
            // jQ112("#lektiko_box").append(temp_lektiko_string);     works only in IE , replaced 
			jQ112("#lektiko_box").val(temp_lektiko_string);
        }
        
    }
    
    function secondStepDefillLektiko()
    {
        jQ112("#lektiko_box").val("");
        // jQ112("#lektiko_box").append(lektiko_string);  works only in IE , replaced 
		jQ112("#lektiko_box").val(lektiko_string);
    }

     
    function openLektikoSRDiv() 
    { 
        jQ112("#lektikoSR_div").css("display","block"); 

    } 
     
    function Calculate_days(date1,date2) 
    { 
        var oneDay = 24*60*60*1000; 
        var days = Math.round(Math.abs((date1.getTime() - date2.getTime())/(oneDay))); 
        jQ112("#inner_days_div").html(days); 
        return days;  
    } 
     
    function copyLektikoSR() 
    { 
        var copied_text = jQ112("#lektiko_box"); 
        if (copied_text && copied_text.select) 
        { 
            // select text 
          copied_text.select(); 
          try 
          { 
            // copy text 
            document.execCommand('copy'); 
            copied_text.blur(); 
          } 
          catch (err) { 
            alert('please press Ctrl/Cmd+C to copy'); 
          } 

        } 
        return false;    
    } 
  


</script> 
<script> 
     
// $(document).ready(function(){ 
       
//     jQ112("input[name='connection_type_sms']").change(function(){  // Αν πατηθεί το αφορά κινητή /σταθερή πηγαίνει στην ResultAcceptance() 
//     if(this.checked){ 
//        $("input[name='connection_type_sms']:checked").not(this).prop('checked', false); 
//     }    
//     ResultAcceptance(globaloption,globalsegment,null,null);  // Πηγαίνει στην ResultAcceptance 
//   }); 
        
}); 
     
     
     
</script> 
     
<script>  //Αλλαγή css στα active κουμπάκια 

       jQ112('body').on('click', 'button', function(e) { 
        var parent = jQ112(this).parent().attr('id'); // Το id του μενού όπου ανήκει το κουμπάκι 
        var allbuttons = ""; 
           switch(parent) 
               { 
                       // ανάλογα το μενού που ανήκει θα κάνει τα άλλα στο default χρώμα και το συγκεκριμένο κόκκινο 
                   case "first_menu_div": 
                        
                       allbuttons = jQ112("#first_menu_div > :input"); 
                       jQ112.each(allbuttons, function(i) { 
                           if(jQ112(allbuttons[i]).text() != "Reset") //Αν δεν είναι το reset που έχει blueviolet χρώμα 
                              { 
                                jQ112(allbuttons[i]).css("background-color","#555555"); 
                              } 

                       }); 
                       if(jQ112(this).text() != "Reset") //Αν δεν είναι το reset που έχει blueviolet χρώμα 
                       { 
                           jQ112(this).css("background-color","red"); 
                       } 

                       break; 
                   case "second_menu_div": 
                        
                       allbuttons = jQ112("#second_menu_div > :input"); 
                       jQ112.each(allbuttons, function(i) { 
                           jQ112(allbuttons[i]).css("background-color","#555555"); 
                       }); 
                       jQ112(this).css("background-color","red"); 
                        
                       break; 
                   case "third_menu_div": 
                        
                       allbuttons = jQ112("#third_menu_div > :input"); 
                       jQ112.each(allbuttons, function(i) { 
                           jQ112(allbuttons[i]).css("background-color","#555555"); 
                       }); 
                       jQ112(this).css("background-color","red"); 
                        
                       break; 
                        
               } 
       }); 
     
</script> 
     
     
<style type="text/css">
    .container 
    { 
        position: relative; 
        width: 80%; 
        min-height: 100px; 
        margin: 100px auto; 
        overflow: overlay; 
        max-height: 1500px;
    } 

    .outerbox 
    { 
        position: relative; 
        left: 0px; 
        width: 100%;
        max-height: 1500px;
        background-color:white; 
        overflow: overlay;
        border:1px solid #eee;
		box-shadow: 0px 2px 7px rgba(0,0,0,0.5);
		background: linear-gradient(to bottom, rgb(249,252,247) 0%,rgb(245,249,240) 100%);     
    }  
     
    #imgdiv 
    {    
        position: relative; 
        top:0px; 
        text-align: center; 
        width:100%; 
        background-repeat: no-repeat; 
        height: 200px;       
    } 
     
    #first_menu_div 
    {    
        position: relative; 
        margin-top: :0px; 
        text-align: center; 
        width:100%; 
        min-height: 50px;     
    } 
     
    #second_menu_div 
    {    
        position: relative; 
        margin-top: :0px; 
        text-align: center; 
        display: none; 
        overflow: overlay; 
        width:100%; 
        border-top-style:solid;
        border-top-width: thin;
        border-top-color: #fff0b3;
        min-height: 50px;   
    } 
    
    #third_menu_div 
    {    
        position: relative; 
        margin-top: :0px; 
        text-align: center; 
        display: none; 
        overflow: overlay; 
        width:100%; 
        border-top-style:solid;
        border-top-width: thin;
        border-top-color: #fff0b3;
        min-height: 50px;       
    } 
    
    .main_menu_div 
    {    
        position: relative; 
        margin-top: 0px; 
        clear: both; 
        text-align: center; 
        display: none; 
        overflow: overlay; 
        width: 100%; 
        border-top-style:solid;
        border-top-width: thin;
        border-top-color: #fff0b3;
        min-height: 460px;   
    } 
    
    .clearfloat
    {
        clear: both;
    }
     
    #checkings_div_outer
    {    
        position: relative; 
        margin-top: 1px; 
        left: 0px; 
        text-align: left; 
        width: 100%; 
        height: 200px; 
    }
    
    #checkings_div_titlos
    {
        position: relative;
        text-align: center;
        font-weight: bold;
    }
    
    #checkings_div_inner
    {
        position: relative;
        border-bottom-color:gray;
		background: white;
		box-shadow: 0px 2px 7px rgba(0,0,0,0.5);
        z-index:1;
        display: none; 
        overflow-y: scroll;	
        height: 180px;
    }
     
    #titlos_div 
    {    
        position: absolute; 
        clear: left; 
        right: 0px; 
        margin: 0 auto; 
        padding: 15px; 
        display: none; 
        text-align: center; 
        width: auto; 
        height: 50px;   
    } 
     
    .outer_process_div 
    { 
        position: relative; 
        clear: both;
        margin-top: 30px; 
        margin-left: 0px; 
        width: 100%; 
        height: auto;
        overflow: overlay;        
    } 
    
    #days_acceptance_div
    {
        position:relative;
        margin-top: 20px;
        margin-left: 0px;
        width: 100%;
        height: 200px;
        clear: both;
        overflow: overlay;
        display:none;
    }
    
    .cal_div 
    { 
        position: relative; 
        float: left; 
        /*display: inline-block;*/ 
        margin-top: 10px; 
        margin-bottom: 10px; 
        margin-left: 10px; 
        width: 220px; 
        height: auto;  
    } 
     
    #outer_days_div 
    { 
        position: relative; 
        float: left; 
        margin-top: 10px; 
        margin-left: 10px; 
        padding-bottom: 10px; 
        width: 90px; 
        height: 90px; 
		border:2px solid #eee;
		box-shadow: 0px 2px 7px rgba(0,0,0,0.5);
		background: white;      
    } 
     
    #inner_days_div 
    { 
        position: relative; 
        float: left; 
        margin-top: 10px; 
        margin-left: 10px; 
        width: 60px; 
        height: 50px;   
    } 
     
    #outer_result_div 
    { 
        position: relative; 
        float: left; 
        margin-top: 10px; 
        margin-bottom: 10px; 
        margin-left: 10px; 
        padding-bottom: 10px; 
        width: 90px; 
        height: 90px; 
		border:2px solid #eee;
		box-shadow: 0px 2px 7px rgba(0,0,0,0.5);
		background: white;
		display:none; 
    } 
      
    #inner_result_div 
    {    
        position: relative; 
        float: left; 
        margin-top: 5px; 
        margin-left: 10px; 
        width: 60px; 
        height: 50px; 
       
    } 
     
    .diakanonismoi_div 
    { 
        position: relative; 
        float:left;
        margin-top: 0px; 
        margin-left: 20px; 
        width: 330px; 
        min-height: 250px; 
        overflow: overlay;
        display: none; 
    } 
    .cal_text_all
    {
        text-align: center;
    }
    #tipos_gramis_sms
    {
        position: relative; 
        text-align: center;
        clear:both;
        margin-top: 15px; 
        left: 0px; 
        width: 100%; 
        height: auto; 
        overflow: visible;
        display: none; 
    }
    
    #tipos_gramis_inner_sms
    {
        text-align: center;
    }
     
    #lektikoSR_div
    {
        position: relative; 
        clear: both; 
        text-align: center; 
        margin-top: 30px;  
        width: 100%; 
        height: auto; 
        display: none; 
    }
    
    #lektikoSR_div table
    {
        text-align: center;
         width: 100%;
    }
    
     
    #actions_div 
    {    
        position: relative; 
        clear: both; 
        top:20px;
        left: 0px; 
        text-align: left; 
        width: 100%; 
        height: 260px; 
        display: none;
    } 
    
    #actions_div_titlos
    {
        position: relative;
        text-align: center;
        font-weight: bold;
        width:100%;
    }
    
    #actions_div_inner
    {
        position: relative;
        width: 100%;
        height: 82%;
        overflow-y: scroll;
        background: white;
        box-shadow: 0px 2px 7px rgba(0,0,0,0.5);
    }
     
    #diakanonismoi_table 
    { 
        border-style: none; 
        text-align: left; 
        padding:3px auto;
    } 
     
    #outer_sms_tool_div 
    { 
        position: relative;
        float: right;
        text-align: center;
        top: 0px; 
        right: 10px; 
        min-width: 300px; 
        height: auto; 
		border:2px solid #eee;
		box-shadow: 0px 2px 7px rgba(0,0,0,0.5);
		background: white;
        align-content: center;
		padding: auto;
        overflow: auto;
        z-index: 1;
    } 
     
    #footer_div 
    {    
        position: relative; 
        top: 0px; 
        text-align: center; 
        width:100%; 
		box-shadow: 0px 2px 7px rgba(0,0,0,0.5);
		padding: 5px;
        min-height: 25px;
    } 
     
    /*img 
    { 
        width: 100%; 
        max-height: 100%; 
    } */
     
    .mcalc-button-darkgrey 
    {
        text-indent:0;
        display:inline-block;
        font-family:Arial;
        font-size:14px;
        font-weight:bold;
        font-style:normal;
        text-decoration:none;
        text-align:center;
        padding:8px 10px;
        margin:8px 10px 8px 10px;
        position:relative;
        top:1px;
        -moz-box-shadow:inset 0px 1px 0px 0px #ffffff;
        -webkit-box-shadow:inset 0px 1px 0px 0px #ffffff;
        box-shadow:inset 0px 1px 0px 0px #ffffff;
        background:-webkit-gradient( linear, left top, left bottom,color-stop(0.05, #ababab), color-stop(1, #cccccc) );
        background:-moz-linear-gradient( center top, #ababab 5%, #cccccc 100% );
        filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ababab', endColorstr='#cccccc');
        background-color:#ababab;
        border:1px solid #a1a1a1;
        color:#ffffff;
	}
     
    .mcalc-button-darkgrey:hover 
    {
        background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #cccccc), color-stop(1, #ababab) );
        background:-moz-linear-gradient( center top, #cccccc 5%, #ababab 100% );
        filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#cccccc', endColorstr='#ababab');
        background-color:#cccccc;
        cursor: pointer; 
    }
    
    .mcalc-button-red-frame 
    {
        background-color:darkgray;  
        border: none; 
        color: white; 
        padding: 14px 28px; 
        text-align: center; 
        text-decoration: none; 
        display: inline-block; 
        font-size: 15px; 
        margin: 4px 2px; 
        -webkit-transition-duration: 0.4s; /* Safari */ 
        transition-duration: 0.4s; 
        cursor: pointer; 
        border: 2px solid #616161; 

    }
    .mcalc-button-red-frame:hover 
    {
        background-color:aliceblue; 
        color: black; 
        box-shadow: box-shadow: 5px 10px 8px #888888; 
    }
    
    .active /* θα βάλουμε αυτήν την κλάση στα active κουμπάκια */
    {
        background-color: red;
    }
     
    .user_numbers_div
    {
        display: inline-block;
        border-style: solid;
        border-color: transparent;
        width: 100%;
    }
    
    .user_numbers_div table
    {
        width: 100%;
        text-align: center;
    }
     
    #sms-type /* Δεν το εμφανίζουμε */ 
    { 
        display: none; 
    } 
     
    #cli_note 
    { 
        font-size: 10px; 
        opacity: 0.8; 
    } 
     
    .resetbtn
    {
        text-indent:0;
        display:inline-block;
        font-family:Arial;
        font-size:14px;
        font-weight:bold;
        font-style:normal;
        text-decoration:none;
        text-align:center;
        padding:8px 10px;
        margin:8px 10px 8px 10px;
        position:relative;
        top:1px;
        -moz-box-shadow:inset 0px 1px 0px 0px #d197fe;
        -webkit-box-shadow:inset 0px 1px 0px 0px #d197fe;
        box-shadow:inset 0px 1px 0px 0px #d197fe;
        background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #a53df6), color-stop(1, #7c16cb) );
        background:-moz-linear-gradient( center top, #a53df6 5%, #7c16cb 100% );
        filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#a53df6', endColorstr='#7c16cb');
        background-color:#a53df6;
        border:1px solid #9c33ed;
        color:#ffffff;
    }
    .resetbtn:hover
    {
        background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #7c16cb), color-stop(1, #a53df6) );
        background:-moz-linear-gradient( center top, #7c16cb 5%, #a53df6 100% );
        filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#7c16cb', endColorstr='#a53df6');
        background-color:#7c16cb;
        cursor: pointer; 
    } 
    .header_title_div
    {
        width:100%;
        height: auto;
        text-align: center; 
        color: black;
        font-weight: bold;
        background-color:lightgray;
    }
    
    .tooltip 
    {
        position: relative;
        display: inline-block;
        text-align: center;
    }

    .tooltiptext 
    {
        visibility: hidden;
        min-width: 400px;
        height: auto;
        background-color:lightgray;
        color:black;
        text-align: center;
        padding: 5px 0;

        /* Position the tooltip */
        position: absolute;
        z-index: 2;
    }

    .tooltip:hover .tooltiptext 
    {
        visibility: visible;
    }
    
    .infotable
    {
        width: 100%;
        font-size:13px;
        text-align: center;
        margin: 0 auto;
    }
    
    .left_field 
    {
        font-family: Arial;
        color: #ffffff;
        font-size: 14px;
        background: #617480;
        text-align: center;
        width: 170px;
        height:30px;
        text-decoration: none;
        border-style: none;
    }
    
    .btn 
    {
        font-family: Arial;
        color: #ffffff;
        font-size: 14px;
        background: #617480;
        text-align: center;
        width: 170px;
        height:30px;
        text-decoration: none;
        border-style: none;
    }

    .btn:hover 
    {
        background: #7d8e99;
        background-image: -webkit-linear-gradient(top, #3cb0fd, #3498db);
        background-image: -moz-linear-gradient(top, #3cb0fd, #3498db);
        background-image: -ms-linear-gradient(top, #3cb0fd, #3498db);
        background-image: -o-linear-gradient(top, #3cb0fd, #3498db);
        background-image: linear-gradient(to bottom, #3cb0fd, #3498db);
        text-decoration: none;
        cursor: pointer;
    }
    
    input[type="text"] 
    {
        height: 25px;
        width: 115px;
    }
    .ui-datepicker-current 
    { 
        display: none; 
    }
	
table.diakanonismos_actions , td, th 
{  border: 1px solid;
  width: 50%;
  border-collapse: collapse;
  text-align:center;
}
th.diakanonismos_actions { background-color:#ccc} 

tr.diakanonismos_actions:nth-child(odd) { background-color:#eee} 


</style>   

  
<div class="container">   
<div class="outerbox"> 
     
    <div id="first_menu_div">First Selection Panel 
    </div> 
     
    <div id="second_menu_div">Secondary Selection Panel 
    </div> 
     
    <div id="third_menu_div">third Selection Panel 
    </div> 
         
    <div class="main_menu_div"> 
     
        <div id="checkings_div_outer"> 
            <div id="checkings_div_titlos" class="header_title_div">Διευκρινήσεις</div>
            <div id="checkings_div_inner"> 

            </div> 
        </div> 
         
        <div class="outer_process_div"> 
            
            <div id ="days_acceptance_div">
                <div class="cal_div"> 
                <input type="button" class="btn" id="cal_button" value="Ημ. Έκδοσης Λογ." /> 
                <p> <input type="text" class="cal_text_all" id="cal_text" disabled></p> 
                </div> 
                <div id = "clearfloat"></div>
                <div class="cal_div"> 
                <input type="button" class="btn" id="cal_button2" value="Επ. Ημ. Πληρωμής." /> 
                <p><input type="text" class="cal_text_all" id="cal_text2" disabled></p> 
                </div> 
                <div id = "clearfloat"></div>
                <div id = "outer_days_div"> 
                Ημέρες: 
                <div id = "inner_days_div"> 
                </div> 
                </div> 
                <div id="outer_result_div">Αποδεκτό; 
                    <div id="inner_result_div"> 
                    </div> 
                </div> 
                <div id = "clearfloat"></div>
            </div>
            
            <div class="diakanonismoi_div">   <!-- Div διακανονισμών Εναρξη --> 
                    <div class="header_title_div">
                    Στοιχεία Διακανονισμού
                    </div>
                    <table id ="diakanonismoi_table" style="width:100%"> 
                        <tbody>
                        <tr> 
                            <td><div class ="left_field">Ποσό Διακανονισμού:</div></td> 
                            <td>
                                <input type="text" id="poso_diakanonismou" style="width: 100px;"  autocomplete="off">
                                <span style="font-size:19px">&#8364;</span>
                           <!--     <div class="tooltip"><img style="cursor: pointer;" id="infoimg" src="/CommonFiles/Images/New_Abacus/info.png" alt="" width="17px" />
                                <span class="tooltiptext"><table class="infotable" border="1" cellpadding="5">
                                    <th colspan="5">Πίνακας Αποδοχής Δόσεων</th>
                                    <tr><td>Ποσό</td><td>100-199&#8364;</td><td>200-499&#8364;</td><td>500-699&#8364;</td><td>700&#8364; +</td></tr>
                                    <tr><td>Δόσεις</td><td>2</td><td>εως 3</td><td>εως 4</td><td>εως 5</td></tr>
                                </table></span>
                                </div> --> 
                                </input>
                            </td>
                        </tr> 
                        <tr> 
                            <td><div class = "left_field">Πλήθος Δόσεων:</div></td> 
                            <td colspan="2"> 
                                <select id="plithos_doseon"> 
                                <option value = "1" selected >-</option>
                                <option value = "2">2 μηνιαίες δόσεις</option>
                                <option value = "3">3 μηνιαίες δόσεις</option>
                                <option value = "4">4 μηνιαίες δόσεις</option>
                                <option value = "5">5 μηνιαίες δόσεις</option>   
                                </select> 
                            </td> 
                            
                        </tr>
                        <tr>
                            <td><input type="button" class="btn" id="cal_button3" value="Πρώτος Λογαριασμός" /></td>
                            <td>
                            <input type="text"  class="cal_text_all" id="cal_text3" disabled>
                            </td>
                        </tr>
                            <tr>
                            <td><input type="button" class="btn" id="cal_button4" value="Τελευταίος Λογαριασμός" /></td>
                            <td><input type="text"  class="cal_text_all" id="cal_text4" disabled></td>
                        </tr>
                        </tbody>
                    </table>
                
                 <div id = "tipos_gramis_sms" > 
                    <div class = "header_title_div">
                    Τύπος Γραμμής
                    </div>
                    <div id = "tipos_gramis_inner_sms">
                        <table  style="margin: 0 auto;">
                        <tr>
                        <td><label><input type="checkbox" class="mygroup3" name="connection_type_sms" id="connection_type_sms_mobile" value="mobile" checked  />&nbsp; Αφορά κινητή</label></td>    
                        </tr>
                        <tr>
                        <td>
                        <label><input type="checkbox" class="mygroup3" name="connection_type_sms" id="connection_type_sms_fixed"  value="fixed"  />&nbsp; Αφορά σταθερή</label>
                        </td>
                        </tr>
                        </table>
                         
                    </div>
                </div>  
                
            <div id="lektikoSR_div">
               <div class="header_title_div"> Λεκτικό SR</div>
                <table>
                    <tr><td><textarea id="lektiko_box" rows="11" style=" width:100%;" ></textarea></td></tr>
                    <tr><td style="text-align: center;"><button type="button" name="copybutton" id="copybutton" onclick ="copyLektikoSR()">Copy Λεκτικού SR</button></td></tr>
               </table>

         </div> 
                 
            </div>                        <!-- Div διακανονισμών λήξη--> 
             
           
             
             
             
            <div id ="outer_sms_tool_div"> 
               <div class = "header_title_div">
                    Αποστολή SMS
              </div>
                <div id="sms-test-mode" class="test-mode">Test mode: Δεν θα σταλούν μηνύματα!</div> 
                    <div id="sms-container"> 
                        <div id="sms-tools-container" class="sms-containers "> 
                            <!-- <img id="sms-help-button" src='/CC/SMS_Tool/PublishingImages/sms_help.png' alt='help!' onclick='smsHelp();'/>  --> 
                    <!--        <div id="sms-bulk-checkbox-container"> 

                                <label for="sms-bulk-checkbox">Bulk</label>&nbsp;<input id="sms-bulk-checkbox" name="sms-bulk-checkbox" type="checkbox" class="js-switch" onchange="toggleBulk();"/> 
                            </div> 
                        </div>--> 
                     <div id="sms-selects-container" class="sms-containers clear"> 
                         <!--   <select id="agent-name" class="personalized sms-selects" onchange="validateMessage();"> 
                                <option value="none">Loading...</option> 
                            </select> --> 
                            <select id="sms-type" class="sms-selects" onchange="validateMessage();">  <!-- Θέλουμε να έχει την τιμή που θα ενεργοποιήσει την attachfields  , Tο onchange δεν γίνεται ποτέ γιατί είναι hidden πεδίο --> 
                                <option value="none" selected>Normal_Sms</option> 
                            </select> 
                        </div> 
                        <div id="sms-custom-container" class="sms-containers sms-custom clear"></div> 
                        <div id="sms-preview-container" class="sms-containers clear"> 
                            <table id="sms-preview" align="center"> 
                                <tbody> 
                                    <tr id="sms-top"> 
                                        <td>&nbsp;</td> 
                                    </tr> 
                                    <tr id="sms-body"> 
                                        <td id="sms-body-text">Preview</td> 
                                    </tr> 
                                    <tr id="sms-btm"> 
                                        <td id="sms-status">&nbsp; </td> 
                                    </tr> 
                                </tbody> 
                            </table> 
                        </div> 
                        <div id="sms-bulk-numbers" class="sms-containers sms-bulk clear"> 
                            <br /><br /> 
                            <textarea name="sms-bulk-inputbox" id="sms-bulk-inputbox" class="sms-textarea" cols="25" rows="8" autocomplete="off">Γράψε εδώ μέχρι 200 MSISDN (χωρισμένα με enter) ή κάνε paste από excel, notepad κ.λπ. και πάτησε "Εισαγωγή"</textarea><br /> 
                        </div> 
                        <div id="sms-bulk-numbers-result" class="sms-containers sms-bulk-hidden clear"></div> 
                        <div id="sms-bulk-import" class="sms-containers sms-bulk clear"></div> 
                        <div id="sms-bulk-load-buttons" class="sms-containers sms-bulk clear"> 
                            <div class="sms-bulk-button-container floatcenter"> 
                                <button type="button" name="loadbutton" id="loadbutton" class="sms-smallerbutton">Εισαγωγή</button>&emsp; 
                                <button type="button" name="clearbutton" id="clearbutton" class="sms-smallerbutton">Καθαρισμός</button> 
                            </div> 
                        </div> 
                        <div id="sms-bulk-buttons" class="sms-containers sms-bulk clear"> 
                            <button type="button" name="gopausebutton" id="gopausebutton" class="smsbutton" disabled>Go!</button> 
                            <button type="button" name="bulkstopbutton" id="bulkstopbutton" class="smsbutton">Stop!</button> 
                        </div> 
                        <div id="sms-bulk-progress" class="sms-containers sms-bulk-hidden clear"></div> 
                        <div id="sms-bulk-results" class="sms-containers sms-bulk-hidden clear"></div> 
                        <div id="sms-button-container" class="sms-containers non-bulk"> 
                            <!--<input type="text" value= "MSISDN" name="subscriber-number" id="subscriber-number" class="sms-inputbox" autocomplete="off"/><button type="button" name="historybutton" id="historybutton" class="smshistory smsbutton historybutton" disabled><img id="historyimg" src="/CC/SMS_Tool/PublishingImages/history_enabled.png" alt="" /></button>&nbsp; --> 
                            <div class="user_numbers_div"> 
                               <table> 
                                   <tr> 
                                       <td>&nbsp;</td> 
                                       <td><input type="text" value= "MSISDN" name="subscriber-number" id="subscriber-number" class="sms-inputbox" autocomplete="off"/> 
                                       </td> 
                                   </tr> 
                              </table> 
                                <br> 
                            </div> 
                             
                            <button type="button" name="historybutton" id="historybutton" class="smshistory smsbutton historybutton" disabled><img id="historyimg" src="/CC/SMS_Tool/PublishingImages/history_enabled.png" alt="" /></button>&nbsp; 
                             
                            <button type="button" name="sendbutton" id="sendbutton" class="smsbutton" disabled>Αποστολή</button><br /><br /> 
                            <div id="sms-result"> </div> 
                            <div id="sms-debug"> </div> 
                            <div id="sms-history"> </div> 
                        </div> 
                    </div> 
                <div id="sms-test-mode" class="test-mode">Test mode: Δεν θα σταλούν μηνύματα!</div>    
                </div>    
             
             
             
        </div> 
         
            
        </div> 
        <div id = "actions_div">
            <div id = "actions_div_titlos" class="header_title_div">Ενέργειες στο σύστημα</div>
            <div id="actions_div_inner"></div>
        </div>
         
     
    </div> 
    <div id="footer_div">Made with <span style="color:#e60000;">❤️</span> by the <span class="cr-team">Knowledge Management and Chatbots Team</span> 
    </div> 
     
     
</div> 
</div> 



