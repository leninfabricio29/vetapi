import { AsyncLocalStorage } from 'async_hooks';

export interface TenantStoreContext {
  veterinariaId: string;
}

export const tenantStore = new AsyncLocalStorage<TenantStoreContext>();
