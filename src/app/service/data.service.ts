import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response, MemberForm, MemberGifts } from '../model/type.service';
import { baseUrl } from '../app.global';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  readonly url = `${baseUrl}/api/v1`;

  constructor(private http : HttpClient) { }

  listMembers() {
    return this.http.get<MemberForm[]>(`${this.url}/member/list`);
  }

  getMember(id: string) {
    return this.http.get<MemberGifts[]>(`${this.url}/member/${id}`);
  }

  deleteMember(id: string, gift: string, token: string) {
    // get auth from cookies
    document.cookie.split(';').forEach((cookie) => {
      let [key, value] = cookie.split('=');
      if (key.trim() === 'token') {
        token = value.trim();
      }
    });

    const headers = new HttpHeaders().set('x-access-header', token);
    console.log(headers.get('x-access-header'));
    console.log(`${this.url}/member/${id}/gift/${gift}/delete`);
    return this.http.delete(`${this.url}/member/${id}/gift/${gift}/delete`, { headers });
  }

  editGift(id:string ,key: string, value: string, hash: string, token: string) {
    const headers = new HttpHeaders().set('x-access-header', token);
    headers.set("key", key);
    headers.set("value", value);
    console.log(headers.get('x-access-header'));
    console.log(`${this.url}/member/${key}/gift/${hash}/edit`);
    return this.http.put(`${this.url}/member/${id}/gift/${hash}/edit`, { headers });

  }
}
