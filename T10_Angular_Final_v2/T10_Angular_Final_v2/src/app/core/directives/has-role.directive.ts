import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.model';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  private roles: UserRole[] = [];

  @Input() set appHasRole(roles: UserRole[]) {
    this.roles = roles;
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    this.viewContainer.clear();
    if (this.authService.hasRole(this.roles)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
