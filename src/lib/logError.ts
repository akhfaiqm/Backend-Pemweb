export function logDbError(context: string, err: unknown) {
  console.error(`[${context}]`, err);
}
