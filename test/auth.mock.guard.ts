import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AuthMockGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        return true;
    }
}