import { Component, computed, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent, form } from '../login/login.component';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  title = signal('DoF Registy');
  isPopupVisible = signal(false);
  is_logged_in = computed(() => this.authService.is_logged_in());
  is_admin = computed(() => this.authService.is_admin());
  is_sudo = computed(() => this.authService.is_sudo());
  username = computed(() => this.authService.username());

  constructor (private authService: AuthService, private dataService: DataService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.is_admin();
    this.is_sudo();
    this.username();
    this.is_logged_in();
  }

  openDialog() {
    this.dialog.open(LoginComponent, {
      data: {
        fields: [
          {name: "username", type: 'text', label: 'Username'},
          {name: "password", type: 'password', label: 'Password'}
        ],
        func: this.loginFunc.bind(this)
      },
    });
  }

  togglePopup() {
    this.isPopupVisible.set(!this.isPopupVisible())
  }

  loginFunc(event: any) {
    event.preventDefault();
    this.authService.login(event.target.form.username.value, event.target.form.password.value)
    this.is_admin();
    this.is_sudo();
    this.username();
    this.is_logged_in();

    this.dialog.closeAll();
  }

   logoutHander(){
    let token = this.authService.get_cookie('token');
    this.authService.logout(token);

    this.is_admin();
    this.is_sudo();
    this.username();
    this.is_logged_in();
  }

  uploadCsvHandler(form: any) {
    form.preventDefault();

    let token = this.authService.get_cookie('token');

    let file = form.target.csv_file.files[0];
    if (!file) {
      alert('No file selected');
      return;
    }

    console.log(form.target.csv_file.files[0]);
    this.dataService.uploadFile(file, token).subscribe(() => {
      alert('File uploaded');
    })
      
  }
}
