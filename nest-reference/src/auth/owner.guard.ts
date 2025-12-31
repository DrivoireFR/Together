import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { UserType } from '../users/entities/user.entity';

@Injectable()
export class OwnerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request['user'];

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        if (user.role !== UserType.OWNER) {
            throw new ForbiddenException('Access denied. Owner role required.');
        }

        return true;
    }
}


