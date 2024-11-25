import {Component, inject, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {AdminService} from '../../shared/services/admin.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Button, ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    TableModule,
    ButtonDirective,
    Button
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  pendingFarmers: any[] = [];
  users: any[] = [];


  adminService = inject(AdminService)
  messageService = inject(MessageService)
  confirmationService = inject(ConfirmationService)

  ngOnInit(): void {
    this.loadPendingFarmers();
    this.loadUsers();
  }

  loadPendingFarmers(): void {
    this.adminService.getPendingFarmers().subscribe({
        next: (data) => {
          this.pendingFarmers = data.data;
        },
        error: (err) => {
          console.error('Error loading pending farmers:', err);
        }
      }
    );
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
        next: (data) => {
          this.users = data.data;
        },
        error: (err) => {
          console.error('Error loading users:', err);
        }
      }
    );
  }

  approveFarmer(farmerId: string): void {
    console.log(farmerId)
    this.confirmationService.confirm({
      message: 'Are you sure you want to approve this farmer?',
      accept: () => {
        this.adminService.approveFarmer(farmerId).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Farmer approved successfully'});
            this.loadUsers();
            this.loadPendingFarmers();
          }
          ,
          error: (err) => {
            console.error('Error approving farmer:', err.message);
          }
        });
      }
    });
  }

  rejectFarmer(farmerId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reject this farmer?',
      accept: () => {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason) {
          this.adminService.rejectFarmer(farmerId, {reason}).subscribe({
              next:
                () => {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Farmer rejected successfully'
                  });
                  this.loadUsers();
                  this.loadPendingFarmers();
                },
              error: (err) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Server Error'
                });
                console.error('Error rejecting farmer:', err);
              }
            }
          );
        }
      }
    });
  }

  editUser(userId: string): void {
    // Implement edit user logic
  }

  deleteUser(userId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      accept: () => {
        this.adminService.deleteUser(userId).subscribe({
            next: (data) => {
              console.log(data)
              this.messageService.add({severity: 'success', summary: 'Success', detail: 'User deleted successfully'});
              this.loadUsers();
              this.loadPendingFarmers();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Server Error'
              });
              console.error('Error deleting user:', err);
            }
          }
        );
      }
    });
  }

  toggleUserStatus(userId: string, currentStatus: string): void {
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    this.confirmationService.confirm({
      message: `Are you sure you want to ${newStatus === 'active' ? 'enable' : 'disable'} this user?`,
      header: 'Confirm Status Change',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.adminService.editUser(userId, {status: newStatus}).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `User status updated to ${newStatus}`
              });
              this.loadUsers();
              this.loadPendingFarmers();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Server Error' + err.message
              });
              console.error('Error updating user status:', err);
            }
          }
        );
      }
    });
  }
}
