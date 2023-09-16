import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class ForgotPasswordGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request) {
    const token = request.body.token || request.params.token;
    if (token) {
      try {
        const foundToken = (await this.authService.findToken(token)).token;

        if (foundToken === token) {
          return true;
        }

        return false;
      } catch (e) {
        return false;
      }
    }
  }
}
