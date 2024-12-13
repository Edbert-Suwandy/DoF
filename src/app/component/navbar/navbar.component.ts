import { Component, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';

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
  is_logged_in = signal(false);
  is_admin = signal(false);
  is_sudo = signal(false);
  username = signal('');

  constructor (private authService: AuthService, private dataService: DataService) {
  }

  ngOnInit(): void {
    this.is_logged_in.set(this.authService.is_logged_in());
    this.is_admin.set(this.authService.is_admin());
    this.is_sudo.set(this.authService.is_sudo());
    this.username.set(this.authService.username());
  }

  togglePopup() {
    this.isPopupVisible.set(!this.isPopupVisible())
  }

  loginHandler(form: any) {
    form.preventDefault();

    this.authService.login(form.target.username.value, form.target.password.value)

    this.is_admin.set(this.authService.is_admin());
    this.is_sudo.set(this.authService.is_sudo());
    this.username.set(this.authService.username());
    this.is_logged_in.set(this.authService.is_logged_in());
  }

  logoutHander() {
    let token = this.authService.get_cookie('token');
    this.authService.logout(token);

    this.is_admin.set(this.authService.is_admin());
    this.is_sudo.set(this.authService.is_sudo());
    this.username.set(this.authService.username());
    this.is_logged_in.set(this.authService.is_logged_in());
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
