/**
 * Which environment a console section is describing.
 *
 * Sandbox is the working copy. Prod is whatever was last deployed to it, so it
 * lags behind until a deploy lands — and only for the things a deploy actually
 * ships. Users, database records and traffic are Prod's own runtime state and
 * never copy across.
 */
export type Env = 'sandbox' | 'prod';

/** True when the section should show Sandbox's content rather than Prod's snapshot. */
export function inSync(env: Env, deployed: boolean) {
  return env === 'sandbox' || deployed;
}
