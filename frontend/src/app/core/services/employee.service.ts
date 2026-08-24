import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Employee, EmployeeQueryParams, EmployeeRequest } from '../models/employee.model';

/**
 * All employee-related API calls live here. Components never call
 * HttpClient or build URLs directly - they call these methods instead.
 * Equivalent of the original React app's services/employeeService.js.
 */
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/employees`;

  getAll(query: EmployeeQueryParams = {}): Observable<Employee[]> {
    const { keyword, departmentId, roleId, status, sortBy, sortDirection } = query;
    let params = new HttpParams();

    if (departmentId) params = params.set('departmentId', departmentId);
    if (roleId) params = params.set('roleId', roleId);
    if (status) params = params.set('status', status);
    if (sortBy) params = params.set('sortBy', sortBy);
    if (sortDirection) params = params.set('sortDirection', sortDirection);

    if (keyword && keyword.trim()) {
      params = params.set('name', keyword.trim());
      return this.http.get<Employee[]>(`${this.baseUrl}/search`, { params });
    }
    return this.http.get<Employee[]>(this.baseUrl, { params });
  }

  getById(id: number | string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  create(payload: EmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, payload);
  }

  update(id: number | string, payload: EmployeeRequest): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
