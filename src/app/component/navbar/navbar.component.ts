import { Component, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { DataService } from '../../service/auth.service';
import { OnInit } from '@angular/core';

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

  constructor (private dataService: DataService) {
  }

  ngOnInit(): void {
    this.is_logged_in.set(this.dataService.is_logged_in());
    this.is_admin.set(this.dataService.is_admin());
    this.is_sudo.set(this.dataService.is_sudo());
    this.username.set(this.dataService.username());
  }

  togglePopup() {
    this.isPopupVisible.set(!this.isPopupVisible())
  }

  loginHandler(form: any) {
    form.preventDefault();

    this.dataService.login(form.target.username.value, form.target.password.value)

    this.is_admin.set(this.dataService.is_admin());
    this.is_sudo.set(this.dataService.is_sudo());
    this.username.set(this.dataService.username());
    this.is_logged_in.set(this.dataService.is_logged_in());
  }

  logoutHander() {
    let token = this.dataService.get_cookie('token');
    this.dataService.logout(token);

    this.is_admin.set(this.dataService.is_admin());
    this.is_sudo.set(this.dataService.is_sudo());
    this.username.set(this.dataService.username());
    this.is_logged_in.set(this.dataService.is_logged_in());
  }
}
