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
  noUser = false;
  ngOnInit() {
    if (this.backendService.isAuthenticated() === true) {
      this.loggedIn = true;
    } else this.loggedIn = false;
    if (this.loggedIn === true) {
      this.backendService.showGithubData()
        .subscribe(
          (response) => {
            this.OneResumeResponse = <string>response.json().data.userRepoData;
            console.log(this.OneResumeResponse.githubusers);
            if (this.OneResumeResponse.githubusers == '') {
                this.noUser = true;
                console.log(this.noUser);
            }else {
              this.noUser = false;
              console.log(this.noUser);
              this.backendService.setOneResumeResponse(this.OneResumeResponse);
            }
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
  getUserFromGithub(){
    this.backendService.makeGithubRequest()
      .subscribe(
        (response) => {
          console.log(response.json());
        },
        (error) => {console.log(error);}
      );
  }

}
