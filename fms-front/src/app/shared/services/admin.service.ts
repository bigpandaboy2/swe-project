import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient) { }

  getPendingFarmers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pending-farmers`);
  }

  approveFarmer(farmerId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/approve-farmer/${farmerId}`, {});
  }

  rejectFarmer(farmerId: string, reason: { reason: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reject-farmer/${farmerId}`, reason);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  editUser(userId: string, updateData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, updateData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }
}
