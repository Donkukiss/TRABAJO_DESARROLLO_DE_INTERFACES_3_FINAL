import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HasRoleDirective } from '../../core/directives/has-role.directive';
import { RolLabelPipe } from '../../core/pipes/rol-label.pipe';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HasRoleDirective, RolLabelPipe],
  templateUrl: './dashboard-home.html',
  styleUrls: ['./dashboard-home.css']
})
export class DashboardHome {
  accessDenied = false;

  constructor(public authService: AuthService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.accessDenied = params['accessDenied'] === 'true';
    });
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }
}
