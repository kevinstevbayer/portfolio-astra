// lighthouserc.cjs
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        'http://localhost/index.html',
        'http://localhost/projects/project-titan-ugv/index.html',
        'http://localhost/projects/mechatronics-lab/index.html',
        'http://localhost/cv/index.html',
      ],
      numberOfRuns: 1,
      settings: {
        preset: 'perf',
        formFactor: 'mobile',
        throttlingMethod: 'simulate',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.02 }],
        'total-byte-weight': ['error', { maxNumericValue: 500000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};