// Pagination utility functions

/**
 * Calculate pagination info
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {Object} Pagination info
 */
export const calculatePagination = (page = 1, limit = 10, total = 0) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit - 1, total - 1);

  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total: parseInt(total),
    totalPages,
    hasNext,
    hasPrev,
    startIndex,
    endIndex,
    showing: total > 0 ? `${startIndex + 1}-${endIndex + 1}` : '0-0'
  };
};

/**
 * Get pagination range for page numbers
 * @param {number} currentPage - Current page
 * @param {number} totalPages - Total pages
 * @param {number} delta - Pages to show around current page
 * @returns {Array} Array of page numbers
 */
export const getPaginationRange = (currentPage, totalPages, delta = 2) => {
  const range = [];
  const rangeWithDots = [];

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (currentPage + delta < totalPages - 1) {
    rangeWithDots.push('...', totalPages);
  } else {
    rangeWithDots.push(totalPages);
  }

  return rangeWithDots.filter((page, index, arr) => arr.indexOf(page) === index);
};

/**
 * Paginate array of items
 * @param {Array} items - Array of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Paginated result
 */
export const paginateArray = (items = [], page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);
  
  return {
    data: paginatedItems,
    pagination: calculatePagination(page, limit, items.length)
  };
};

/**
 * Build query string for pagination
 * @param {Object} params - Query parameters
 * @returns {string} Query string
 */
export const buildPaginationQuery = (params = {}) => {
  const query = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      query.append(key, params[key]);
    }
  });
  
  return query.toString();
};

/**
 * Parse pagination from URL search params
 * @param {URLSearchParams} searchParams - URL search params
 * @returns {Object} Parsed pagination params
 */
export const parsePaginationFromUrl = (searchParams) => {
  return {
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 10,
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'createdAt',
    order: searchParams.get('order') || 'desc'
  };
};

/**
 * Get page size options
 * @returns {Array} Array of page size options
 */
export const getPageSizeOptions = () => {
  return [
    { value: 5, label: '5 per page' },
    { value: 10, label: '10 per page' },
    { value: 20, label: '20 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' }
  ];
};

/**
 * Format pagination info text
 * @param {Object} pagination - Pagination object
 * @returns {string} Formatted text
 */
export const formatPaginationInfo = (pagination) => {
  const { page, limit, total, totalPages } = pagination;
  
  if (total === 0) {
    return 'No items found';
  }
  
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  
  return `Showing ${start}-${end} of ${total} items (Page ${page} of ${totalPages})`;
};

/**
 * Check if page is valid
 * @param {number} page - Page number
 * @param {number} totalPages - Total pages
 * @returns {boolean} Is valid page
 */
export const isValidPage = (page, totalPages) => {
  return page >= 1 && page <= totalPages;
};

/**
 * Get safe page number
 * @param {number} page - Page number
 * @param {number} totalPages - Total pages
 * @returns {number} Safe page number
 */
export const getSafePage = (page, totalPages) => {
  if (totalPages === 0) return 1;
  if (page < 1) return 1;
  if (page > totalPages) return totalPages;
  return page;
};

/**
 * Create pagination metadata for API response
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {Object} Pagination metadata
 */
export const createPaginationMeta = (page, limit, total) => {
  const pagination = calculatePagination(page, limit, total);
  
  return {
    page: pagination.page,
    limit: pagination.limit,
    total: pagination.total,
    totalPages: pagination.totalPages,
    hasNext: pagination.hasNext,
    hasPrev: pagination.hasPrev,
    showing: pagination.showing
  };
};

/**
 * Debounce function for search input
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function for scroll events
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, delay) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, delay);
    }
  };
};

export default {
  calculatePagination,
  getPaginationRange,
  paginateArray,
  buildPaginationQuery,
  parsePaginationFromUrl,
  getPageSizeOptions,
  formatPaginationInfo,
  isValidPage,
  getSafePage,
  createPaginationMeta,
  debounce,
  throttle
};