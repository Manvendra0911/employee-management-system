import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Role, RoleRequest } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/roles`;

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(this.baseUrl);
  }

  getById(id: number | string): Observable<Role> {
    return this.http.get<Role>(`${this.baseUrl}/${id}`);
  }

  create(payload: RoleRequest): Observable<Role> {
    return this.http.post<Role>(this.baseUrl, payload);
  }

  update(id: number | string, payload: RoleRequest): Observable<Role> {
    return this.http.put<Role>(`${this.baseUrl}/${id}`, payload);
  }
}
