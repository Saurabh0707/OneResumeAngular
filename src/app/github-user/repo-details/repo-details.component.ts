import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Params, Route, Router} from "@angular/router";
import {BackendService} from "../../backend.service";

@Component({
  selector: 'app-repo-details',
  templateUrl: './repo-details.component.html',
  styleUrls: ['./repo-details.component.css']
})
export class RepoDetailsComponent implements OnInit {
  errorResponse: any;
  username: any;
  @Output() OneResumeUser: EventEmitter<string> = new EventEmitter<string>();
  repo;
  id: number;
  constructor(private route: ActivatedRoute, private router: Router, private backendService: BackendService) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.username = this.route.snapshot.params['username'];
          this.backendService.showGithubUser(this.username)
            .subscribe(
              (response) => {
                this.OneResumeUser.emit(<string>response.json().data.userRepoData);
              },
              (error) => {
                this.errorResponse = error.json();
                console.log(this.errorResponse.error);
              }
            );
           this.id = +params['id'];
          console.log(this.id);
          this.repo = this.backendService.getRepo(this.id);
          console.log('repodetails called');
        }
      );
  }
}
