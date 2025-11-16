import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class ProfileService {

  private base = `${environment.apiBaseUrl}/admin/profile`;

  constructor(private http: HttpClient) {}

  getProfile(email: string) {
    return this.http.get<any>(`${this.base}/${email}`);
  }

  updateProfile(email: string, body: any) {
    return this.http.put(`${this.base}/${email}`, body);
  }

  changePassword(email: string, body: any) {
    return this.http.post(`${this.base}/${email}/change-password`, body);
  }

  uploadImage(email: string, file: File) {
    const form = new FormData();
    form.append("file", file);
    return this.http.post(`${this.base}/${email}/upload-image`, form);
  }

}
