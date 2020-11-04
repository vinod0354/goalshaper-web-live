import { Component, OnInit } from '@angular/core';
import { EnterpriseService } from 'src/app/services';
import { GlobalService } from 'src/app/global/app.global.service';
// import { TeamCreateComponent } from '../../../team-create/team-create.component';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.css']
})
export class TeamInfoComponent implements OnInit {

  constructor(private enterpriseService: EnterpriseService, private globals: GlobalService) { }
  filterBy: string = '';
  searchText: string = '';
  searchBy: any;
  public TogetTeam = [];
  ngOnInit() {
    this.ToLoadTeamManager();
  }
  

  //Toload Team Info Details
  ToLoadTeamManager() {
    var TogeteamroleId = JSON.parse(localStorage.getItem("currentUser"));
    console.log(TogeteamroleId)
    console.log(TogeteamroleId.user.role_id);
    let TeamInfoId = this.globals.currentUserId;
    console.log(TeamInfoId);
    this.globals.showLoading('Please wait');
    this.enterpriseService.togetTeamMangerInfo(TeamInfoId).subscribe(
      (result) => {
        this.globals.hideLoading('Please wait');
        console.log(result)
        this.TogetTeam = result.body;
        console.log(this.TogetTeam)
      }
    );
  }

  //To refresh page values
  refreshPageData(){
    this.ToLoadTeamManager();

  }

  // For search Filter
  refreshSearch() {
		this.searchBy = this.getSearchObject();
	}

  getSearchObject() {
		let searchObj = {};
		if (this.filterBy == '') {
			searchObj['name'] = this.searchText;
      searchObj['email'] = this.searchText;
		} else if (this.filterBy == 'name') {
			searchObj['name'] = this.searchText;
		} else if (this.filterBy == 'email') {
			searchObj['email'] = this.searchText;
		}
    return searchObj;
  }
}
