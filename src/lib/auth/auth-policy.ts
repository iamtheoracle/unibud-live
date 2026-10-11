export function shouldRejectDisabledAuth(input: {
  databaseConfigured: boolean;
  isProduction: boolean;
  gateIdentityEnabled: boolean;
}): boolean {
  return !input.gateIdentityEnabled && (input.databaseConfigured || input.isProduction);
}
