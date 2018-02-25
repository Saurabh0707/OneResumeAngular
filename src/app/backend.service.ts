import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {LocalStorageService} from 'ng2-webstorage';
import 'rxjs/Rx';
import {HttpParams} from "@angular/common/http";
@Injectable()
export class BackendService{

  base_url = 'http://127.0.0.1:8000/api/';
  github_redirect_url = 'https://github.com/login/oauth/';
  // this.apiurl+'logout?token='+token
  loginResponse: {token_type: string, expires_in: string, access_token: string, refresh_token: string};
  OneResumeResponse;
  OneResumeUser;
  loggedIn;
  repos: any;
  constructor(private http: Http, private storage: LocalStorageService) {}

  isAuthenticated() {
    if (this.storage.retrieve('storedsession') == null) {
      return false;
    }
    return true;
  }

  login(value: Object) {
    console.log(value);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(this.base_url + 'login', value, { headers: headers});
  }
  register(value: Object) {
    console.log(value);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(this.base_url + 'register', value, { headers: headers});

  }

  logout() {
    console.log(this.loginResponse.access_token);
    this.storage.clear('storedsession');
    this.loggedIn = false;
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token});
    console.log(headers);
    return this.http.get(this.base_url + 'logout', {headers: headers});
  }
  onLogin(value) {
    console.log(value);
    this.loginResponse = value;
    this.loggedIn = true;
    this.storage.store('storedsession', value);
  }
  onRegister(value) {
    console.log(value);
    this.loginResponse = value;
    this.loggedIn = true;
    this.storage.store('storedsession', value);
  }
  showGithubData(){
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token});
    return this.http.get(this.base_url + 'github/thisuser', {headers: headers});
  }
  showGithubUser(username) {
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token});
    return this.http.get(this.base_url + 'github/showthisuser/' + username, {headers: headers});
  }
  setRepos(repos) {
    this.repos = repos;
  }
  setOneResumeResponse(OneResumeResponse) {
    this.OneResumeResponse = OneResumeResponse;
  }
  setOneResumeUser(OneResumeUser) {
    this.OneResumeUser = OneResumeUser;
  }
  // makeGithubRequest() {
  //   const client_id = 'c98f06e52785cdf675ec';
  //   const redirect_url = 'http://localhost:8000/api/oauth2/github';
  //   let params = new HttpParams();
  //   params = params.append('client_id', client_id);
  //   params = params.append('redirect_uri', redirect_url);
  //   params = params.append('response_type', 'code');
  //   params = params.append('scope', '*');
  //   console.log(params);
  //   return this.http.get(this.github_redirect_url + 'authorize', {params: params});
  //   // return this.http.get(this.base_url + 'user/github');
  // }
  // getGithubRequest() {
  //   console.log('backend');
  //   const getRequest_url = 'http://localhost:8000/api/oauth2/github';
  //   return this.http.get(getRequest_url);
  // }
  getRepo(index: number) {
    console.log(this.repos);
    return this.repos[index];
  }
  getRequest(request_code) {
      console.log(request_code);
      const body = JSON.stringify({
      'grant_type': 'authorization_code',
      'client_id': 'c98f06e52785cdf675ec',
      'client_secret': 'e93b809b53a6fed3289b780251220b1ef563ea6a',
      'redirect_uri': 'http://localhost:4200/oauth2/github',
      'code': request_code
    });
    console.log(body);
    const headers = new Headers({'Content-Type': 'application/json', 'Action': 'application/json'});
    return this.http.post('https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token', body,
        { headers: headers});
  }
  storeGithubToken(access_token) {
    console.log(access_token);
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token});
    return this.http.post(
      'http://127.0.0.1:8000/api/github/storeGithubToken',
      {'access_token': access_token},
      { headers: headers}
      );
  }
  deleteGitHubToken() {
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token});
    return this.http.get(
      'http://127.0.0.1:8000/api/github/deleteGithubToken',
      { headers: headers}
    );
  }
  fetchGithubUser(){
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token});
    return this.http.get(
      'http://127.0.0.1:8000/api/github/user',
      { headers: headers}
    );
  }
  fetchGithubRepos(){
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token});
    return this.http.get(
      'http://127.0.0.1:8000/api/github/user/repos',
      { headers: headers}
    );
  }
  showUserProfile(){
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token});
    return this.http.get(
      'http://127.0.0.1:8000/api/github/showthisuser/{username}',
      { headers: headers}
    );
  }
  onEducationSubmit(value: Object){
    console.log(value);
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token, 'Content-Type': 'application/json'});
    return this.http.post(
      this.base_url + 'addEducation', value,
      { headers: headers}
    );
  }
  onSkillSubmit(value: Object){
   console.log(value);
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token, 'Content-Type': 'application/json'});
    return this.http.post(
      this.base_url + 'addSkill', value,
      { headers: headers}
    );
  }
  onWorkSubmit(value: Object) {
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token, 'Content-Type': 'application/json'});
    console.log(value);
    return this.http.post(
      this.base_url + 'addWork', value,
      { headers: headers}
    );
  }
  onAchievementSubmit(value: Object) {
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token, 'Content-Type': 'application/json'});
    return this.http.post(
      this.base_url + 'addAchievement', value,
      { headers: headers}
    );
  }
  onDeleteWork(id){
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token, 'Content-Type': 'application/json'});
    return this.http.get(
      this.base_url + 'deleteWork/' + id, { headers: headers}
    );
  }
  onDeleteEducation(id){
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token, 'Content-Type': 'application/json'});
    return this.http.get(
      this.base_url + 'deleteEducation/' + id , { headers: headers}
    );
  }
  onDeleteSkill(id){
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token, 'Content-Type': 'application/json'});
    return this.http.get(
      this.base_url + 'deleteSkill/' + id, { headers: headers}
    );
  }
  onDeleteAchievement(id){
    const headers = new Headers({'Authorization': 'Bearer ' + this.loginResponse.access_token, 'Content-Type': 'application/json'});
    return this.http.get(
      this.base_url + 'deleteAchievement/' + id, { headers: headers}
    );
  }
}
