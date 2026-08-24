import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Department, DepartmentRequest } from '../models/department.model';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/departments`;

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.baseUrl);
  }

  getById(id: number | string): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/${id}`);
  }

  create(payload: DepartmentRequest): Observable<Department> {
    return this.http.post<Department>(this.baseUrl, payload);
  }

  update(id: number | string, payload: DepartmentRequest): Observable<Department> {
    return this.http.put<Department>(`${this.baseUrl}/${id}`, payload);
  }
}
