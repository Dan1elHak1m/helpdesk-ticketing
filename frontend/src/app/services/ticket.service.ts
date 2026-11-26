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

  get(id: number) {
    return this.http.get<any>(`${API}/tickets/${id}`);
  }

  update(id: number, data: { status?: string; assigned_to?: number | null }) {
    return this.http.patch(`${API}/tickets/${id}`, data);
  }

  addComment(id: number, message: string) {
    return this.http.post(`${API}/tickets/${id}/comments`, { message });
  }

  agents() {
    return this.http.get<{ id: number; name: string }[]>(`${API}/users/agents`);
  }

  stats() {
    return this.http.get<{
      byStatus: { status: string; count: number }[];
      byPriority: { priority: string; count: number }[];
    }>(`${API}/stats`);
  }
}