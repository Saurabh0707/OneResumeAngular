import {Component, OnDestroy, OnInit} from '@angular/core';
import {BackendService} from '../backend.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
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
  i;
  submitAllDataPending;
  ngOnInit() {
    this.submitAllDataPending = false;
    this.i = 0;
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      this.request_code = queryParams['code'];
      console.log(queryParams['code']);
    });
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
          'githubrepos': this._fb.array([
            this._fb.group({
              'owner': null,
              'name': null,
              'html_url': null,
              'clone_url': null,
              'repo_created_at': null,
              'repo_updated_at': null,
              'repo_pushed_at': null,
              'public_repos': null,
              'no_of_commits': null,
              'no_of_branches': null,
              'no_of_pullrequests': null,
              'no_of_contributors': null,
              'repobranches': this._fb.array([]),
              'repocommits': this._fb.array([]),
              'repocontributors': this._fb.array([]),
              'repolangs': this._fb.array([]),
              'repo_p_rs': this._fb.array([]),
            })
          ]),
        }),
      }),
    });

    // if (this.backendService.isAuthenticated() === true) {
    //   this.loggedIn = true;
    // } else {
    //   this.loggedIn = false;
    // }

    // if (this.loggedIn === true) {
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
    // }
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
              'githubrepos': this._fb.array([]),
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
  denySubmitFromGithub(){
    this.backendService.deleteGitHubToken().subscribe(
      (response) => {
        this.access_token =  '';
        this.step2 = this.step1 = this.step3  = this.step4  = false;
        console.log(response);
        this.githubUserResponse = response;
        this.router.navigate(['/github']);
        this.myForm.reset();

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
  pushRepoToArray(repo, commits, requests, contributors, branches, langs){
          console.log(langs);
          let commitsKey, commitsCount = 0;
          let requestsKey, requestsCount = 0;
          let contributorsKey, contributorsCount = 0;
          let branchesKey, branchesCount = 0;
          let languagesKey, languagesCount = 0;
          let newRepoKey, newRepoCount = 0;
          for (commitsKey in commits) {
            if (commits.hasOwnProperty(commitsKey)){
              commitsCount++;
            }
          }
          for (requestsKey in requests) {
            if (requests.hasOwnProperty(requestsKey)){
              requestsCount++;
            }
          }for (branchesKey in branches) {
            if (branches.hasOwnProperty(branchesKey)){
              branchesCount++;
            }
          }
          for (contributorsKey in contributors){
            if (contributors.hasOwnProperty(contributorsKey)){
              contributorsCount++;
            }
          }
          for (languagesKey in langs) {
            if (langs.hasOwnProperty(languagesKey)){
              languagesCount++;
            }
          }
          const githubRepo = this.myForm.get('userRepoData.githubusers.githubrepos');
          console.log(githubRepo);
          (githubRepo as FormArray ).push(
            this._fb.group({
              'owner': repo.owner.login,
              'name': repo.name,
              'html_url': repo.html_url,
              'clone_url': repo.clone_url,
              'repo_created_at': repo.created_at,
              'repo_updated_at': repo.updated_at,
              'repo_pushed_at': repo.pushed_at,
              'public_repos': 1,
              'no_of_commits': commitsCount,
              'no_of_branches': branchesCount,
              'no_of_pullrequests': requestsCount,
              'no_of_contributors': contributorsCount,
            'repobranches': this._fb.array([]),
            'repocommits': this._fb.array([]),
            'repocontributors': this._fb.array([]),
            'repolangs': this._fb.array([]),
            'repo_p_rs': this._fb.array([]),
              }));
        console.log(newRepoCount);
    const thisRepo  = (<FormArray>this.myForm.get('userRepoData.githubusers.githubrepos')).at(this.i);
    const githubBranches = thisRepo.get('repobranches');
    const githubCommits = thisRepo.get('repocommits');
    const githubContributors = thisRepo.get('repocontributors');
    const githubRequests = thisRepo.get('repo_p_rs');
    const githubLangs = thisRepo.get('repolangs');
    for (let branch of branches){
    (githubBranches as FormArray ).push(
      this._fb.group({
        'name': branch.name,
      }));
    }
    for (let commit of commits){
    (githubCommits as FormArray ).push(
      this._fb.group({
        'author': commit.commit.author.name,
        'committer': commit.commit.committer.name,
        'message': commit.commit.message,
        'commit_created_at': commit.commit.author.date,
        'commit_updated_at': commit.commit.author.date,
        'sha': commit.sha,
      }));
    }
    for (let contributor of contributors){
    (githubContributors as FormArray ).push(
      this._fb.group({
        'name': contributor.login,
        'contributions': contributor.contributions,
      }));
    }
    for (let request of requests){
    (githubRequests as FormArray ).push(
      this._fb.group({
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
    for (let key in langs) {
      if (langs.hasOwnProperty(key)) {
        console.log(key + " -> " + langs[key]);
        (githubLangs as FormArray ).push(
          this._fb.group({
            'name': key,
            'lines': langs[key],
          }));
      }
    }
    console.log(this.myForm.value);
    this.i++;
  }
  submitReposFromGithub() {
    this.step3 = false;
    this.submitAllDataPending = true;
    this.step4 = true;
      console.log(this.myForm);
      const sendJson  = (JSON.parse(JSON.stringify(this.myForm.value)));
      this.backendService.onAllSubmit(JSON.stringify(sendJson))
        .subscribe(
          (response) => {
            this.myForm.reset();
            console.log(response.json());
            this.backendService.addedNewUser = true;
            this.router.navigate(['/github']);
            },
          (error) => {
            console.log(error.json());
          }
        );
    }
}
