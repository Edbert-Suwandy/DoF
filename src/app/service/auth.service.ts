import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { baseUrl } from '../app.global';
import { token } from '../model/type.service';
import {jwtDecode, JwtPayload} from 'jwt-decode';

interface ExtendedJwtPayload extends JwtPayload {
  is_sudo?: boolean;
  is_admin?: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class DataService {
  readonly url = `${baseUrl}/api/v1/admin`;

  is_logged_in = signal<boolean>(false);
  is_admin = signal<boolean>(false);
  is_sudo = signal<boolean>(false);
  username = signal<string>('');
  token = signal<string>('');

  constructor(private http : HttpClient) {
    this.is_logged_in.set(this.get_cookie('is_logged_in') === 'true');
    this.is_admin.set(this.get_cookie('is_admin') === 'true');
    this.is_sudo.set(this.get_cookie('is_sudo') === 'true');
    this.username.set(this.get_cookie('username'));
    this.token.set(this.get_cookie('token'));
   }

  purge_cookie(key: string) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  set_cookie(key: string, value: string) {
    document.cookie = `${key}=${value}; path=/; sameSite=strict;`;
  }

  get_cookie(key: string) {
    let result = '';
    document.cookie.split(';').forEach((cookie) => {
      let [k, v] = cookie.split('=');
      if (k.trim() === key) {
        result = v.trim();
      }
    });
    return result;
  }

  login(username: string, password: string) {
    let request = this.http.get<token>(`${this.url}/login`, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${username}:${password}`)
      }
    });
    request.subscribe((res: token) => {
      if (!res.token) {
        alert('Invalid username or password');
        return;
      }
      this.token.set(res.token);
      this.set_cookie('token', res.token);

      let decoded = jwtDecode<ExtendedJwtPayload>(res.token);
      this.username.set(username);
      this.set_cookie('username', username);
      this.set_cookie('is_logged_in', 'true');

      if (decoded.is_admin) {
        console.log(this.is_admin());
        this.set_cookie('is_admin', 'true');
        this.is_admin.set(true);
      }

      if (decoded.is_sudo) {
        this.set_cookie('is_sudo', 'true');
        this.is_sudo.set(true);
      }

      this.is_logged_in.set(true);
    });
    return;
  }

  logout(token: string) {
    this.http.get(`${this.url}/logout`, {
      headers: {
        'token': token
      }
    });
    //purge the cookies
    this.purge_cookie('token');
    this.purge_cookie('username');
    this.purge_cookie('is_logged_in');
    this.purge_cookie('is_admin');
    this.purge_cookie('is_sudo');

    //clear the signals
    this.is_logged_in.set(false);
    this.is_admin.set(false);
    this.is_sudo.set(false) ;
    this.username.set('');
    this.token.set('');
  }
}
