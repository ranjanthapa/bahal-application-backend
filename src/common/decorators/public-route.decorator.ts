import { SetMetadata } from '@nestjs/common';

export const PUBLIC_ROUTE_KEY = 'public-route-key';
export const PublicRoute = () => SetMetadata(PUBLIC_ROUTE_KEY, true);
