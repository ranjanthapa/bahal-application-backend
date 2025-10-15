// import { CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { PUBLIC_ROUTE_KEY } from 'src/common/decorators/public.decorator';
// // import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
// // import { Role } from 'src/common/enums/designation.enum';
// // import { User } from 'src/features/user/entities/user.entity';

// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}
//   canActivate(context: ExecutionContext) {
//     const isPublicRoute = this.reflector.get<boolean>(
//       PUBLIC_ROUTE_KEY,
//       context.getHandler()
//     );
//     if (isPublicRoute) {
//       return true;
//     }

//     const attachedRole = this.reflector.getAllAndOverride<Role[]>(
//       ROLES_KEY,
//       [context.getHandler(), context.getClass()]
//     );

//     if (!attachedRole || attachedRole.length === 0) {
//       return true;
//     }

//     const request = context.switchToHttp().getRequest<{ user: User }>();
//     const role = request.user.employee.designation;

//     if (role === Role.ADMIN) {
//       return true;
//     }
//     return attachedRole.includes(role as Role);
//   } 
// }
