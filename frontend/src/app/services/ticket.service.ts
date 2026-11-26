import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../core/api';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);

  list(status = '') {
    return this.http.get<any[]>(`${API}/tickets`, { params: status ? { status } : {} });
  }

  create(data: { title: string; description: string; priority: string }) {
    return this.http.post<{ id: number }>(`${API}/tickets`, data);
  }
}