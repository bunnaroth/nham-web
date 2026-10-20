export function badRequest(message: string): never {
    throw Object.assign(new Error(message), { status: 400 });
}

export function validateObject(
    value: unknown,
    field = "Request body",
): asserts value is Record<string, unknown> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        badRequest(`${field} must be an object.`);
    }
}

export function validatePositiveInteger(
    value: unknown,
    field: string,
): asserts value is number {
    if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
        badRequest(`${field} must be a positive integer.`);
    }
}

export function validateNonEmptyString(
    value: unknown,
    field: string,
): asserts value is string {
    if (typeof value !== "string" || value.trim().length === 0) {
        badRequest(`${field} must be a non-empty string.`);
    }
}
