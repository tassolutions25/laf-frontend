export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: 'auth/logout',
    },
    SESSION: {
        STATUS: '/session/status',
        CLAIM: '/session/claim',
        EXTEND: '/session/extend',
        RELEASE: '/session/release',
    },
    LAF: {
        REGISTER: '/laf/register',
        SUGGESTION: '/laf/suggestion',
        SEARCH: '/laf/search',
        ARCHIVE: (id: string | number) => `/laf/${id}/archive`,
    },
    ITERATIONS: {
        REQUEST: '/iterations/request',
        PENDING: '/iterations/pending',
        REVIEW: (id: string | number) => `/iterations/${id}/review`,
        SEARCH: '/iterations/search',
    },
    DASHBOARD: {
        SUMMARY: '/dashboard/summary',
    },
    REPORTS: {
        LAF: '/reports/laf',
        LAF_PRINT: (id: string | number) => `reports/laf/print/${id}`,
        ITERATION: 'reports/iteration',
        ITERATION_PRINT: (id: string | number) => `reports/iteration/print/${id}`,
    },
    AUDIT: {
        SEARCH: '/audit-trail/search',
        LOG: '/audit-trail/log',
    },
    CONFIG: {
        BASE: '/config',
        BY_KEY: (key: string) => `/config/${key}`,
    },
} as const;