import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {LocalStorageService} from 'ng2-webstorage';
import 'rxjs/Rx';
@Injectable()
export class BackendService{

  base_url = 'http://127.0.0.1:8000/api/';
  loginResponse: {token_type: string, expires_in: string, access_token: string, refresh_token: string};
  OneResumeResponse;
  OneResumeUser;
  loggedIn;
  repos;
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
    const headers = new Headers({'Authorization': 'Bearer '+this.loginResponse.access_token});
    console.log(headers);
    return this.http.get(this.base_url + 'logout', {headers: headers});
  }
  onLogin(value) {
    console.log(value);
    this.loginResponse = value;
    this.storage.store('storedsession', value);
  }
  onRegister(value) {
    console.log(value);
    this.loginResponse = value;
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
}
