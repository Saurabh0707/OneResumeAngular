import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BackendService} from '../backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LocalStorageService} from 'ng2-webstorage';

declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  registerForm: FormGroup;
  loginForm: FormGroup;
  loggedIn= false;
  constructor(private backendService: BackendService, private storage: LocalStorageService, private router: Router, private route: ActivatedRoute) { }

  @ViewChild ('loginModal') loginModal: ElementRef;
  @ViewChild ('registerModal') registerModal: ElementRef;

  ngOnInit() {
    if(!this.backendService.isAuthenticated() === true || this.backendService.loggedIn ===false){
      this.loggedIn = false;

    }else {
      this.loggedIn = true;
      this.backendService.loginResponse = this.storage.retrieve('storedsession');
    }
    this.registerForm = new FormGroup({
      'registerName': new FormControl(null, Validators.required),
      'registerEmail': new FormControl(null, Validators.required),
      'registerPwd': new FormControl(null, Validators.required)
    });
    this.loginForm = new FormGroup({
      'loginEmail': new FormControl(null, Validators.required),
      'loginPwd': new FormControl(null, Validators.required)
    });
  }
  onSubmitLogin() {
    const sendJson  = (JSON.parse(JSON.stringify(this.loginForm.value)));
    sendJson['client_id'] = '10';
    sendJson['client_secret'] = '8Z4E1j4LKRtIG5tljx3XyS0Mh5bvqLNM0npgUonU';

    this.backendService.login(JSON.stringify(sendJson))
      .subscribe(
        (response) => {
          this.loginForm.reset();
          console.log(response.json());
          this.loggedIn = true;
          console.log(this.loggedIn);
          this.backendService.onLogin(response.json());
          $(this.loginModal.nativeElement).modal('hide');
          this.router.navigate(['/'], {relativeTo: this.route });
        },
        (error) => {console.log(error.json()); }
      );
  }
  onLogin() {
    $(this.loginModal.nativeElement).modal('show');
  }
  onRegister(){
    $(this.registerModal.nativeElement).modal('show');
  }
  onLogout() {
    this.backendService.logout()
      .subscribe(
        (response) => {
          console.log(response.json());
          this.loggedIn = false;
          this.router.navigate(['/'], {relativeTo: this.route});
          return this.backendService.logout();
        },
        (error) => {
          console.log(error),
            this.router.navigate(['/'], {relativeTo: this.route });
        });
  }
  onSubmitRegister() {
    const sendJson  = (JSON.parse(JSON.stringify(this.registerForm.value)));
    sendJson['client_id'] = '10';
    sendJson['client_secret'] = '8Z4E1j4LKRtIG5tljx3XyS0Mh5bvqLNM0npgUonU';

    this.backendService.register(JSON.stringify(sendJson))
      .subscribe(
        (response) => {
          this.registerForm.reset();
          this.loggedIn = true;
          this.backendService.onRegister(response.json());
          $(this.registerModal.nativeElement).modal('hide');
          this.router.navigate(['/'], {relativeTo: this.route});
        },
        (error) => {
          console.log(error.json());
        }
      );
  }
}

