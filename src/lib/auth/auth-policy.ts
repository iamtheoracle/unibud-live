export function shouldRejectDisabledAuth(input: {
  databaseConfigured: boolean;
  isProduction: boolean;
  gateIdentityEnabled: boolean;
}): boolean {
  return !input.gateIdentityEnabled && (input.databaseConfigured || input.isProduction);
}

export function hasProductionAuthConfiguration(input: {
  isProduction: boolean;
  issuer?: string;
  clientId?: string;
  clientSecret?: string;
  baseURL?: string;
  secret?: string;
}): boolean {
  if (!input.isProduction) return true;
  return Boolean(
    input.issuer?.trim() &&
    input.clientId?.trim() &&
    input.clientSecret?.trim() &&
    input.baseURL?.trim() &&
    input.secret?.trim(),
  );
}
