// Accumulates signup fields across the SignUp -> Verification -> BasicDetails
// -> LocationSetup wizard, since the account is only actually created once we
// have a location (the Spring Boot backend requires it).
const KEY = "resqai.signupDraft";

export function getSignupDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function mergeSignupDraft(partial) {
  const next = { ...getSignupDraft(), ...partial };
  sessionStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearSignupDraft() {
  sessionStorage.removeItem(KEY);
}
