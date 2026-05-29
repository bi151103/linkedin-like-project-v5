import { Injectable } from '@angular/core';
import {
  BaseRouteReuseStrategy,
  ActivatedRouteSnapshot,
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ReuseRouteStrategyService extends BaseRouteReuseStrategy {
  override shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot,
  ): boolean {
    if (future.routeConfig === curr.routeConfig) {
      return false;
    }
    return super.shouldReuseRoute(future, curr);
  }
}
