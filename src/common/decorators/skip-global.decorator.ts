import { SetMetadata } from '@nestjs/common';

export const SKIP_GLOBAL_INTERCEPTORS = 'SKIP_GLOBAL_INTERCEPTORS';
export const SkipGlobalInterceptors = () => SetMetadata(SKIP_GLOBAL_INTERCEPTORS, true);
