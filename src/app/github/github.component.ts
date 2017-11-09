import { Component, OnInit } from '@angular/core';
import {BackendService} from '../backend.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.css']
})
export class GithubComponent implements OnInit {

  constructor(private backendService: BackendService, private router: Router) { }
  loggedIn= false;
  OneResumeResponse;
  errorResponse;

  ngOnInit() {
    if(this.backendService.isAuthenticated()===true){
      this.loggedIn = true;
    }else this.loggedIn = false;
    if(this.loggedIn === true) {
      this.backendService.showGithubData()
        .subscribe(
          (response) => {
            this.OneResumeResponse = <string>response.json().data.userRepoData;
            this.backendService.setOneResumeResponse(this.OneResumeResponse);
             },
          (error) => {
            this.errorResponse = error.json();
            console.log(this.errorResponse.error);
            if (this.errorResponse.code === 401) {
              this.backendService.logout();
              this.loggedIn = false;
              this.router.navigate(['/']);
            }
          }
        );
    }
  }
}
