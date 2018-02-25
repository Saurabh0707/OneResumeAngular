import { Component, OnInit } from '@angular/core';
import {BackendService} from '../backend.service';
import {Router} from "@angular/router";
import {Http} from "@angular/http";

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.css']
})
export class GithubComponent implements OnInit {

  constructor(private backendService: BackendService, private http: Http, private router: Router) { }
  loggedIn= false;
  github_redirect_url = 'https://github.com/login/oauth/';
  OneResumeResponse;
  errorResponse;
  noUser = false;
  pendingResponse;
  ngOnInit() {
    this.pendingResponse = true;
    if (this.backendService.isAuthenticated() === true) {
      this.loggedIn = true;
    } else this.loggedIn = false;
    if (this.loggedIn === true) {
      this.backendService.showGithubData()
        .subscribe(
          (response) => {
            this.pendingResponse = false;
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
  // getUserFromGithub() {
  //   this.backendService.makeGithubRequest()
  //     .subscribe(
  //       (response) => {
  //         console.log(response.json());
  //       },
  //       (error) => {console.log(error);
  //       }
  //     );
  // }
  getUserFromGithub() {
    const client_id = 'c98f06e52785cdf675ec';
    const redirect_url = 'http://localhost:4200/oauth2/github';
    window.location.href = this.github_redirect_url + 'authorize?client_id='+ client_id+'&redirect_uri='+redirect_url+'&response_type=code&scope=*';
  }
}
