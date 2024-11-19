import {Component, inject} from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Button
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
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
      this.authService.login(this.loginForm.value).subscribe({
        next: (data: any) => {
          if (this.authService.isLoggedIn()){
            if(this.authService.getUserRole() == 'farmer') {
              this.router.navigate(['/farmer-dashboard'])
            }else {
              this.router.navigate(['/buyer-dashboard'])
            }
          }
          console.log(data);
        }, error: (err) => {
          this.messageService.add({severity: 'error', summary: err.message})
        }
      })
    }
  }
}
