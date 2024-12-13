import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MemberForm, Ba, Member, BaForm, BusinessForm, Business } from '../model/type';
import { baseUrl } from '../app.global';
import { defaultEquals } from '@angular/core/primitives/signals';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  readonly url = `${baseUrl}/api/v1`;

  constructor(private http : HttpClient) { }

  listMembers() {
    return this.http.get<MemberForm[]>(`${this.url}/member/list`);
  }

  getMember(id: string, from?: string, to?: string) {
    if (!from) {
      from = '1/1/1970';
    }
    if (!to) {
      to = '30/1/2090';
    }
    return this.http.get<Member>(`${this.url}/member/${id}?start=${from}&end=${to}`);
  }

  deleteGift(id: string, gift: string, token: string) {
    const headers = new HttpHeaders().set('x-access-header', token);
    console.log(headers.get('x-access-header'));
    console.log(`${this.url}/member/${id}/gift/${gift}/delete`);
    return this.http.delete(`${this.url}/member/${id}/gift/${gift}/delete`, { headers });
  }

  editGift(id: string, key: string, value: string, hash: string, token: string) {
    token = token.trim();
    value = value.trim();
    key = key.trim();

    const headers = new HttpHeaders()
      .set("x-access-header", token)
      .set("key", key)
      .set("value", value);

    console.log(headers.get("key"));
    console.log(headers.get("value"));

    return this.http.patch(`${this.url}/member/${id}/gift/${hash}/update`, {}, { headers });
  }

  deleteMember(id: string, token: string) {
    const headers = new HttpHeaders().set('x-access-header', token);
    return this.http.delete(`${this.url}/member/${id}/delete`, { headers });
  }

  listBusinessArea() {
    return this.http.get<BaForm[]>(`${this.url}/businessArea/list`);
  }

  getBusinessArea(name: string, from?: string, to?: string) {
    if (!from) {
      from = '1/1/1970';
    }
    if (!to) {
      to = '30/1/2090';
    }
    return this.http.get<Ba>(`${this.url}/businessArea/${name}?start=${from}&end=${to}`);
  }

  listBusiness() {
    return this.http.get<BusinessForm[]>(`${this.url}/business/list`);
  }

  getBusiness(name: string, from?: string, to?: string) {
    if (!from) {
      from = '1/1/1970';
    }
    if (!to) {
      to = '30/1/2090';
    }
    return this.http.get<Business>(`${this.url}/business/${name}?start=${from}&end=${to}`);
  }

  uploadFile(file: File, token: string) {
    const headers = new HttpHeaders().set('x-access-header', token);
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.url}/admin/upload`, formData, { headers });
  }

  deleteBusiness(name: string, token: string) {
    const headers = new HttpHeaders().set('x-access-header', token);
    return this.http.delete(`${this.url}/business/${name}/delete`, { headers });
  }

  renameBa(old_name: string, new_name: string, token: string) {
    token = token.trim();
    const headers = new HttpHeaders().set("x-access-header", token);

    return this.http.patch(`${this.url}/businessArea/${old_name}/rename?new_name=${new_name}`, {}, { headers });
  }

  renameB(old_name: string, new_name: string, token: string) {
    token = token.trim();
    const headers = new HttpHeaders().set("x-access-header", token);

    return this.http.patch(`${this.url}/business/${old_name}/rename?new_name=${new_name}`, {}, { headers });
  }

}
