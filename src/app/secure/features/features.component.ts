import { Component, OnInit, PipeTransform } from '@angular/core';
import { GlobalService } from '../../global/app.global.service';
import { EnterpriseService } from '../../services/enterprise.service';
import { Enterprise, EnterpriseCategory } from 'src/app/models/enterprise';
import { Constants } from 'src/app/global/app.global.constants';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {

  searchText: string;
  searchBy: any;
  searchFields: {
    name: string;
  };
  filterBy: string = 'name';
  public EnterpriseMap:any = []
  constructor(private globals: GlobalService, private enterpriseService: EnterpriseService) {
    // var localEnterpriseFeatures = localStorage.getItem('EnterpriseFeatures');
    // if(localEnterpriseFeatures != undefined && localEnterpriseFeatures != null && localEnterpriseFeatures != ''){
    //   this.EnterpriseMap = JSON.parse(localEnterpriseFeatures);
    // }else{
      this.loadEnterprisemapping();
   // }
    this.searchBy = { name: this.searchText };
  }

  searchResults(text: string, pipe: PipeTransform): Enterprise[] {
		return this.EnterpriseMap.filter((enterprise) => {
			const term = text.toLowerCase();
			return (
				enterprise.name.toLowerCase().includes(term) ||
				pipe.transform(enterprise.country_name).includes(term)
			);
		});
  }


  refreshSearch() {
		this.searchBy = this.getSearchObject();
	}

	getSearchObject() {
		let searchObj = {};
		if (this.filterBy == '') {
			searchObj['name'] = this.searchText;
		} else if (this.filterBy == 'name') {
			searchObj['name'] = this.searchText;
		}
		return searchObj;
	}

  ngOnInit() {

  }

  refreshPageData(){
    this.loadEnterprisemapping();
  }

  loadEnterprisemapping() {
    this.globals.showLoading('Please wait');
    this.enterpriseService.getAllEnterprisesMappingFeatures().subscribe(
      (result) => {
        console.log(result);
        this.globals.hideLoading('Please wait');
        if(result.status == Constants.HTTP_STATUS_OK){
          this.EnterpriseMap = result.body;
          for(var i = 0; i < this.EnterpriseMap.length; i++){
            var strIds = this.EnterpriseMap[i].mapping_feature_ids;
            if(strIds.indexOf('Not') == -1){
              var featureIds = strIds.split(',');
              var mapArray = [];
              for(var j = 1; j < 7; j++){
                var featureFound = false;
                for(var k = 0; k < featureIds.length; k++){
                  if(parseInt(featureIds[k]) == j){
                    mapArray.push(1);
                    featureFound = true;
                  }
                }
                if(!featureFound){
                  mapArray.push(0);
                }
              }
              this.EnterpriseMap[i]['mapArray'] = mapArray;
            }else{
              this.EnterpriseMap[i]['mapArray'] = [0,0,0,0,0,0];
            }
          }

          console.log(this.EnterpriseMap);
          localStorage.setItem('EnterpriseFeatures', JSON.stringify(this.EnterpriseMap));
        }else if(result.status == Constants.HTTP_STATUS_NO_CONTENT){
          this.EnterpriseMap = [];
          //this.globals.showSuccessMessage('No enterprises available.');
          localStorage.setItem('EnterpriseFeatures', JSON.stringify(this.EnterpriseMap));
        }else{
          this.globals.showErrorMessage(Constants.MSG_LOADING_DATA_FAILED);
        }

      },(error) => {
        this.globals.showErrorMessage(Constants.MSG_LOADING_DATA_FAILED);
        console.log('Error Block');
        console.log(error);
      }
    );
  }
}
