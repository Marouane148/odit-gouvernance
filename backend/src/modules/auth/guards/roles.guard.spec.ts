import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when no roles are required', () => {
    const context = {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'user' },
        }),
      }),
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(null);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should return true when user has required role', () => {
    const context = {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'admin' },
        }),
      }),
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException when user has no role', () => {
    const context = {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          user: {}
        }),
      }),
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

    expect(() => guard.canActivate(context)).toThrow('Accès non autorisé');
  });

  it('should throw ForbiddenException when user role does not match required roles', () => {
    const context = {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'user' }
        }),
      }),
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

    expect(() => guard.canActivate(context)).toThrow('Vous n\'avez pas les droits nécessaires');
  });
});