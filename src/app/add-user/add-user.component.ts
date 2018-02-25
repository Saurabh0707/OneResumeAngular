import {Component, OnDestroy, OnInit} from '@angular/core';
import {BackendService} from '../backend.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, OnDestroy {
  constructor( private _fb: FormBuilder, private backendService: BackendService,
               private router: Router, private activatedRoute: ActivatedRoute) { }
  loggedIn = false;
  errorResponse;
  request_code;
  access_token = '';
  step1= false;
  step2= false;
  step3= false;
  step4= false;
  githubUserResponse;
  githubReposResponse;
  myForm = new FormGroup({});
  pendingResponse;
  pendingResponse2;
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      this.request_code = queryParams['code'];
      console.log(queryParams['code']);
    });

    if (this.backendService.isAuthenticated() === true) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
    if (this.loggedIn === true) {
      this.backendService.getRequest(this.request_code)
        .subscribe(
          (response: any) => {
            if (response._body.substr(0, 12) == 'access_token') {
              this.access_token = response._body.substr(13, 40);
              this.step1 = true;
              console.log(this.access_token);
              this.backendService.storeGithubToken(this.access_token).subscribe(
                (apiResponse: any) => {
                  console.log(apiResponse);
                },
                (apiError: any) => {
                  console.log(apiError);
                }
              );
            } else {
              this.backendService.deleteGitHubToken().subscribe(
                (response2) => {
                  this.access_token =  '';
                  this.step2 = this.step1 = this.step3  = false;
                  console.log(response2);
                  this.router.navigate(['/github']);

                },
                (error => {
                    console.log(error);
                  }
                ));
            }
          },
          (error) => {
            this.errorResponse = error.json();
            console.log(this.errorResponse);
            if (this.errorResponse.code === 401) {
              this.backendService.logout();
              this.loggedIn = false;
              this.router.navigate(['/']);
            }
          }
        );
      // this.myForm = new FormGroup({
      //   'userRepoData' : new FormGroup({
      //     // 'name': new FormControl(null),
      //     // 'email': new FormControl(null),
      //     'githubusers': new FormGroup({
      //       'username': new FormControl(null),
      //       'html_url': new FormControl(null),
      //       'name': new FormControl(null),
      //       'company': new FormControl(null),
      //       'location': new FormControl(null),
      //       'user_created_at': new FormControl(null),
      //       'user_updated_at': new FormControl(null),
      //       'public_repos': new FormControl(null),
      //       'public_gists': new FormControl(null),
      //       'githubrepos': new FormArray([]),
      //     }),
      //   }),
      // });
      this.myForm = this._fb.group({
        'userRepoData' : this._fb.group({
          // 'name': new FormControl(null),
          // 'email': new FormControl(null),
          'githubusers': this._fb.group({
            'username': null,
            'html_url': null,
            'name': null,
            'company': null,
            'location': null,
            'user_created_at': null,
            'user_updated_at': null,
            'public_repos': null,
            'public_gists': null,
            'githubrepos': this._fb.array([]),
          }),
        }),
      });
    }

  }
  ngOnDestroy(){

  }
  fetchUserFromGithub(){
    this.pendingResponse = true;
    this.backendService.fetchGithubUser().subscribe(
      (response) => {
        console.log(response.json());
        this.githubUserResponse = <string>response.json().data;
        this.pendingResponse = false;
        this.step1 = false;
        this.step2 = true;
        // this.myForm.patchValue({
        //   'userRepoData' : {
        //     // 'name': 'this.githubUserResponse.user.name' ,
        //     // 'email' : 'xxxx',
        //     'githubusers' : {
        //       'username': this.githubUserResponse.user.login,
        //       'html_url': this.githubUserResponse.user.html_url,
        //       'name': this.githubUserResponse.user.name,
        //       'company': this.githubUserResponse.user.company,
        //       'location': this.githubUserResponse.user.location,
        //       'user_created_at': this.githubUserResponse.user.created_at,
        //       'user_updated_at': this.githubUserResponse.user.updated_at,
        //       'public_repos': this.githubUserResponse.user.public_repos,
        //       'public_gists':  this.githubUserResponse.user.public_gists,
        //     }
        //   }
        // });
        this.myForm = this._fb.group({
          'userRepoData' : this._fb.group({
            // 'name': new FormControl(null),
            // 'email': new FormControl(null),
            'githubusers': this._fb.group({
              'username': this.githubUserResponse.user.login,
              'html_url': this.githubUserResponse.user.html_url,
              'name': this.githubUserResponse.user.name,
              'company': this.githubUserResponse.user.company,
              'location': this.githubUserResponse.user.location,
              'user_created_at': this.githubUserResponse.user.created_at,
              'user_updated_at': this.githubUserResponse.user.updated_at,
              'public_repos': this.githubUserResponse.user.public_repos,
              'public_gists': this.githubUserResponse.user.public_gists,
            }),
          }),
        });

        console.log(this.myForm.value);
        },
      (error) => {
        console.log(error);
      }
    );
  }
  denyUserFromGithub(){
    this.backendService.deleteGitHubToken().subscribe(
      (response) => {
        this.access_token =  '';
        this.step2 = this.step1 = this.step3  = this.step4  = false;
        console.log(response);
        this.githubUserResponse = response;
        this.router.navigate(['/github']);

      },
      (error => {
        console.log(error);
        }
    ));
   }
   fetchReposFromGithub(){
    this.pendingResponse2 = true;
    this.backendService.fetchGithubRepos().subscribe(
      (response) => {
        console.log(response.json());
        this.githubReposResponse = <string>response.json().data
        this.pendingResponse2 = false;
        this.step1 = false;
        this.step2 = false;
        this.step3 = true;

       },
      (error) => {
        console.log(error);
      }
    );
  }
  onChange(repo, commits, requests, contributors, branches, langs,  isChecked: boolean){
        if (isChecked) {
         console.log('aayaa');
         const length = (<FormArray>this.myForm.get('userRepoData.githubusers.githubrepos')).length;
          const githubRepos = (<FormArray>this.myForm.get('userRepoData.githubusers.githubrepos')).at(length-1);
          console.log(githubRepos);
          // githubRepos.push(this._fb.group({
          //     'owner': repo.owner.login,
          //     'name': repo.name,
          //     'html_url': repo.html_url,
          //     'clone_url': repo.clone_url,
          //     'repo_created_at': repo.created_at,
          //     'repo_updated_at': repo.updated_at,
          //     'repo_pushed_at': repo.pushed_at,
          //     'public_repos': repo.public_repos,
          //     'no_of_commits': commits.length,
          //     'no_of_branches': branches.length,
          //   'no_of_pullrequests': requests.length,
          //   'no_of_contributors': contributors.length,
          //   'repobranches': this._fb.array([]),
          //   'repocommits': this._fb.array([]),
          //   'repocontributors': this._fb.array([]),
          //   'repolangs': this._fb.array([]),
          //   'repo_p_rs': this._fb.array([]),
          //     }));
          for (const commit of commits) {
            (commit as FormArray).push(this._fb.group({
                'author': commit.commit.author.name,
                'committer': commit.commit.committer.name,
                'message': commit.commit.message,
                'commit_created_at': commit.commit.author.date,
                'commit_updated_at': commit.commit.author.date,
                'sha': commit.sha,
              }));
          }
          for (const contributor of contributors) {
            (contributor as FormArray).push(this._fb.group({
                'name': contributor.login,
                'contributions': contributor.contributions,
              }));
          }
          for (const branch of branches) {
            (branch as FormArray).push(this._fb.group({
              'name': branch.name,
              }));
          }

          for (const request of requests) {
            (request as FormArray).push(this._fb.group({
              'open_issues': request.open_issues,
                'state': request.state,
                'title': request.title,
                'body': request.body,
                'assignee': request.assignee,
                'creator': request.state,
                'pr_created_at': request.created_at,
                'pr_updated_at': request.updated_at,
                'pr_closed_at': request.closed_at,
                'pr_merged_at': request.merged_at,
              }));
          }
          langs.forEach((value, index) => {
            new FormGroup({
              'name': index,
              'lines': value,
            });
          });
          console.log(this.myForm.value);
        }
        }

          // (<FormArray>this.myForm.get('userRepoData.githubusers.githubrepos')).push(
          //  new FormGroup({
          //    'owner': new FormControl(repo.owner.login),
          //    'name': new FormControl(repo.name),
          //    'html_url': new FormControl(repo.html_url),
          //    'clone_url': new FormControl(repo.clone_url),
          //    'repo_created_at': new FormControl(repo.created_at),
          //    'repo_updated_at': new FormControl(repo.updated_at),
          //    'repo_pushed_at': new FormControl(repo.pushed_at),
          //    'public_repos': new FormControl(repo.public_repos),
          //    'no_of_commits': new FormControl(commits.length),
          //    'no_of_branches': new FormControl(branches.length),
          //    'no_of_pullrequests': new FormControl(requests.length),
          //    'no_of_contributors': new FormControl(contributors.length),
          //    'repobranches': new FormArray([]),
          //    'repocommits': new FormArray([]),
          //    'repocontributors': new FormArray([]),
          //    'repolangs': new FormArray([]),
          //    'repo_p_rs': new FormArray([])
          //  })
         // );

    // else{
     //
     // }
}
