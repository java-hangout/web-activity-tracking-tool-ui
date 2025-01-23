// utils.js

export const getTopWebsitesData = (reports) => {
  const siteTimeMap = {};

  // Check if reports is defined and is an array
  if (Array.isArray(reports)) {
    reports.forEach((report) => {
      if (report && report.users) {
        report.users.forEach((user) => {
          if (user && user.browsers) {
            user.browsers.forEach((browser) => {
              if (browser && browser.visitedSites) {
                browser.visitedSites.forEach((site) => {
                  if (site && site.title && site.totalTimeSpentInMinutes) {
                    // Accumulate the total time spent on each site
                    siteTimeMap[site.title] = (siteTimeMap[site.title] || 0) + site.totalTimeSpentInMinutes;
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  // Convert to array and sort
  const sortedSites = Object.entries(siteTimeMap)
    .map(([siteTitle, totalTimeSpentInMinutes]) => ({
      siteTitle,
      totalTimeSpentInMinutes,
    }))
    .sort((a, b) => b.totalTimeSpentInMinutes - a.totalTimeSpentInMinutes);

  // Return top 10 sites
  return sortedSites.slice(0, 10);
};
