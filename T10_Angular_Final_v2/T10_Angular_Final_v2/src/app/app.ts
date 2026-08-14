import { Component, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {

  private platformId = inject(PLATFORM_ID);

  constructor(public authService: AuthService, private router: Router) { }


  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event): void {
    if (isPlatformBrowser(this.platformId) && this.authService.isAuthenticated()) {

      this.logout();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
