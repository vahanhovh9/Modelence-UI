/*
 * Assets exported from the Figma file (Exploration) and committed under
 * public/assets. The ds-* set comes from the current design-system frames
 * (883:4354 dark / 883:4497 bright) — unlike the older exports these are whole
 * 16x16 / 12x12 icons with their own viewBox, so they need no inset framing.
 */
export const assets = {
  // Brand marks — rendered as-is, never tinted.
  logoMark: '/assets/ds-logo-mark.svg',
  claude: '/assets/ds-claude.svg',
  /* OpenAI's mark is monochrome, so it is painted through the icon mask. */
  codex: '/assets/ds-codex.svg',

  // Monochrome icons — painted through a mask so they follow currentColor.
  chevron12: '/assets/ds-chevron-12.svg',
  chevron16: '/assets/ds-chevron-16.svg',
  chevronAgent: '/assets/ds-chevron-agent.svg',
  chevronModel: '/assets/ds-chevron-model.svg',
  refresh: '/assets/ds-refresh.svg',
  externalLink: '/assets/ds-external-link.svg',
  zap: '/assets/ds-zap.svg',
  sandbox: '/assets/ds-sandbox.svg',
  prod: '/assets/ds-prod.svg',
  plus: '/assets/ds-plus.svg',
  check: '/assets/ds-check.svg',
  expand: '/assets/ds-expand.svg',
  attach: '/assets/ds-attach.svg',
  stop: '/assets/ds-stop.svg',
  arrowUp: '/assets/ds-arrow-up.svg',
  separator: '/assets/ds-separator.svg',
  agentCollapsed: '/assets/ds-agent-collapsed.svg',
  viewOnWeb: '/assets/ds-view-on-web.svg',
  sparkle: '/assets/ds-sparkle.svg',
  stepCheck: '/assets/ds-step-check.svg',
  stepDeploy: '/assets/ds-step-deploy.svg',
  warning: '/assets/ds-warning.svg',
  logBranch: '/assets/ds-log-branch.svg',
  lock: '/assets/ds-lock.svg',
  upload: '/assets/ds-upload.svg',
  copy: '/assets/ds-copy.svg',
  connect: '/assets/ds-connect.svg',
  github: '/assets/ds-github.svg',
  history: '/assets/ds-history.svg',
  search: '/assets/ds-search.svg',
  close: '/assets/ds-close.svg',
  fileImage: '/assets/ds-file-image.svg',
  viewList: '/assets/ds-view-list.svg',
  viewGrid: '/assets/ds-view-grid.svg',

  // Prod console navigation.
  navEnvironment: '/assets/ds-nav-environment.svg',
  navDeployments: '/assets/ds-nav-deployments.svg',
  navCode: '/assets/ds-nav-code.svg',
  navFiles: '/assets/ds-nav-files.svg',
  navConfig: '/assets/ds-nav-config.svg',
  navUsers: '/assets/ds-nav-users.svg',
  navDatabase: '/assets/ds-nav-database.svg',
  navMonitoring: '/assets/ds-nav-monitoring.svg',
  navAlerts: '/assets/ds-nav-alerts.svg',
  navLogs: '/assets/ds-nav-logs.svg',
  navAi: '/assets/ds-nav-ai.svg',

  // Account dashboard.
  dashDashboard: '/assets/ds-dash-dashboard.svg',
  dashTeam: '/assets/ds-dash-team.svg',
  dashUsage: '/assets/ds-dash-usage.svg',
  dashSettings: '/assets/ds-dash-settings.svg',
  dashDocs: '/assets/ds-dash-docs.svg',
  dashGear: '/assets/ds-dash-gear.svg',
  avatar: '/assets/ds-avatar.png',
  visa: '/assets/ds-visa.svg',
  thinkingRail: '/assets/ds-thinking-rail.svg',

  // Environments added beyond the frame, from the project's own icon set.
  rocket: '/assets/icon-rocket.svg',
  play: '/assets/icon-play.svg',
  themeDark: '/assets/icon-theme-dark.svg',
  themeBright: '/assets/icon-theme-bright.svg',

  builderPreview: '/assets/builder-preview-calendar.png',
} as const;
