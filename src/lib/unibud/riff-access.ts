/**
 * Client-side presentation policy for the device-local Riff implementation.
 *
 * This is not an authorization boundary. Any future shared Riff server
 * mutations must independently require a verified member session.
 */
export type RiffAccess = {
  canReadDeviceLocalState: boolean;
  canMutateDeviceLocalState: boolean;
};

export function resolveRiffAccess(isAuthenticated: boolean): RiffAccess {
  return {
    canReadDeviceLocalState: isAuthenticated,
    canMutateDeviceLocalState: isAuthenticated,
  };
}

export function visibleDeviceLocalRiffs<T>(
  localRiffs: readonly T[],
  access: RiffAccess,
): readonly T[] {
  return access.canReadDeviceLocalState ? localRiffs : [];
}
