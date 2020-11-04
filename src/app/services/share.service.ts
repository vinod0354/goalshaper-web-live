import { Injectable } from '@angular/core';
import * as json2csv from 'json2csv'; // convert json file to csv
import { saveAs } from 'file-saver';  // save the file


@Injectable({ providedIn: 'root' })
export class ShareService {
    Json2csvParser = json2csv.Parser;
    
    constructor() {

     }
     public downloadFile(data:any, filename? : string){
        let  fields = ['Action', 'Created_Date', 'Modified_Date','Do_Date','Due_Date','Completed_Date','Description','Category_Name'];
        let csvData = this.convertToCSV(data,fields);
        let file = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
        saveAs(file,"Actions.csv");
    }



    public convertToCSV(objArray: any, fields?) {
        console.log("fields,",fields)
        const opts = { fields };
        let json2csvParser = new this.Json2csvParser(opts);
        let csv = json2csvParser.parse(objArray);
        console.log(csv);
        return csv;
    }

   

}