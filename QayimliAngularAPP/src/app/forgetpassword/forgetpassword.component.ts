import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimengtoolsModule } from '../primengtools/primengtools.module';

@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [PrimengtoolsModule, ReactiveFormsModule],  // Corrected imports
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.css'
})
export class ForgetpasswordComponent {
  forgetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  });

  SendResetLink() {
    if (this.forgetPasswordForm.valid) {
      // Handle sending reset password link here
      console.log('Password reset link sent');
    } else {
      console.log('Invalid email');
    }
  }
}