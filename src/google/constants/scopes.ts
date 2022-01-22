export const scopesData = {
  sheets: 'https://www.googleapis.com/auth/spreadsheets',
  email: 'email',

  getScopes(scopes: string[]) {
    return scopes.map((scope: string) => this[scope]);
  }
}