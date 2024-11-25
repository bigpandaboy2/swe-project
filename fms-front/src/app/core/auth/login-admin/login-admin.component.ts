import {Component, inject} from '@angular/core';
import {Button} from "primeng/button";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from '../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-login-admin',
  standalone: true,
    imports: [
        Button,
        ReactiveFormsModule
    ],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.scss'
})
export class LoginAdminComponent {

  authService: AuthService = inject(AuthService);
  router = inject(Router);
  messageService = inject(MessageService);

  protected loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.authService.loginAdmin(this.loginForm.value).subscribe({
        next: (data: any) => {
          if (this.authService.isLoggedIn()){
            this.router.navigate(['/admin-dashboard'])
          }
          console.log(data);
        }, error: (err) => {
          this.messageService.add({severity: 'error', summary: err.message})
        }
      })
    }
  }

}
