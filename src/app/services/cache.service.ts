import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, any>();

  get(key: string): any {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  clear(key: string): void {
    this.cache.delete(key);
  }

  clearAll(): void {
    this.cache.clear();
  }
}