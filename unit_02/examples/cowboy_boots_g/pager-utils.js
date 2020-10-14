const db = require('./db');

/**
 * Construct a pager object, for use with the pager partial view.
 * @param {any} query The query to be executed (without limit and offset clauses)
 * @param {number} pageSize the number of items per page
 * @param {number} pageNumber the current page number (starts at 1)
 * @param {string} url url for the current page
 * @returns {Promise<object>}
 */
const getPager = async (query, pageSize, pageNumber, url) => {
  pageSize = parseInt(pageSize) || 10;
  pageNumber = parseInt(pageNumber) || 1;

  const count = await getCount(query);
  const pager = {
    count,
    pageSize,
    pageNumber,
    pageSizeOptions: getPageSizeOptions(pageSize),
  };
  if (count > pageSize) {
    pager.pages = [];
    for (let i = 0, p = 1; i < count; i += pageSize, ++p) {
      pager.pages.push({
        url: getPageUrl(url, p),
        text: p,
        active: p == pageNumber,
      });
    }
    if (pageNumber > 1) {
      pager.firstUrl = getPageUrl(url, 1);
      pager.prevUrl = getPageUrl(url, pageNumber - 1);
    }
    const lastPage = pager.pages.length;
    if (pageNumber < lastPage) {
      pager.lastUrl = getPageUrl(url, lastPage);
      pager.nextUrl = getPageUrl(url, pageNumber + 1);
    }
  }
  return pager;
};

/**
 * Count the number of results in the full result set.
 * @param {any} query The query to be executed (without limit and offset clauses)
 * @returns {Promise<number>}
 */
const getCount = (query) =>
  db.knex
    .from({ q: query })
    .count('* as count')
    .first()
    .then((row) => row.count);

/**
 * Construct a URL for a page of results.
 * @param {string} url url for the current page
 * @param {number} p page number
 */
const getPageUrl = (url, p) => {
  const regex = /page=\d+/gi;
  if (regex.test(url)) {
    return url.replace(regex, `page=${p}`);
  } else if (url.includes('?')) {
    return `${url}&page=${p}`;
  } else {
    return `${url}?page=${p}`;
  }
};

/**
 * Returns a list of options to use with a page size dropdown.
 * @param {number} pageSize the number of items per page
 */
const getPageSizeOptions = (pageSize) => {
  return {
    selected: pageSize,
    options: [
      { value: 10, text: '10 items per page' },
      { value: 20, text: '20 items per page' },
      { value: 100, text: '100 items per page' },
    ],
  };
};

module.exports = {
  getPager,
  getCount,
  getPageUrl,
  getPageSizeOptions,
};
