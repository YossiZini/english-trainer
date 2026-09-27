/**
 * In-memory query helpers shared by StaticStore (read-only content) and
 * FirestoreDatabase (dynamic collections, where range filters, sorting and
 * limits are applied after the equality-filtered fetch).
 *
 * Criteria semantics, kept identical to the former JsonDatabase:
 *   { field: value }                 equality
 *   { field: [a, b] }                $in
 *   { field: { $gt: x, $lte: y } }   operators
 */

function matchesOperators(fieldValue, operators) {
  for (const [op, opValue] of Object.entries(operators)) {
    switch (op) {
      case '$gt':
        if (!(fieldValue > opValue)) return false;
        break;
      case '$gte':
        if (!(fieldValue >= opValue)) return false;
        break;
      case '$lt':
        if (!(fieldValue < opValue)) return false;
        break;
      case '$lte':
        if (!(fieldValue <= opValue)) return false;
        break;
      case '$ne':
        if (fieldValue === opValue) return false;
        break;
      case '$in':
        if (!opValue.includes(fieldValue)) return false;
        break;
      case '$nin':
        if (opValue.includes(fieldValue)) return false;
        break;
      case '$exists':
        if (opValue && fieldValue === undefined) return false;
        if (!opValue && fieldValue !== undefined) return false;
        break;
      case '$regex': {
        const regex = new RegExp(opValue, operators.$options || '');
        if (!regex.test(fieldValue)) return false;
        break;
      }
      case '$like':
        if (!fieldValue || !fieldValue.toLowerCase().includes(opValue.toLowerCase())) return false;
        break;
      case '$options':
        break;
      default:
        if (fieldValue !== opValue) return false;
    }
  }
  return true;
}

function matchesCriteria(record, criteria) {
  for (const [key, value] of Object.entries(criteria)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (!matchesOperators(record[key], value)) return false;
    } else if (Array.isArray(value)) {
      if (!value.includes(record[key])) return false;
    } else if (record[key] !== value) {
      return false;
    }
  }
  return true;
}

function filterRecords(data, criteria = {}) {
  if (Object.keys(criteria).length === 0) return [...data];
  return data.filter(record => matchesCriteria(record, criteria));
}

function sortRecords(data, sortOptions) {
  return [...data].sort((a, b) => {
    for (const [field, direction] of Object.entries(sortOptions)) {
      const aVal = a[field];
      const bVal = b[field];
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

/** Apply { sort, offset, limit } to an already filtered array. */
function applyOptions(results, options = {}) {
  let out = results;
  if (options.sort) out = sortRecords(out, options.sort);
  if (options.offset) out = out.slice(options.offset);
  if (options.limit) out = out.slice(0, options.limit);
  return out;
}

/**
 * Split criteria into the part Firestore can evaluate server-side (plain
 * equality on scalar values) and the remainder evaluated in memory.
 */
function splitCriteria(criteria = {}) {
  const remote = {};
  const local = {};
  for (const [key, value] of Object.entries(criteria)) {
    const isScalar = value === null || ['string', 'number', 'boolean'].includes(typeof value);
    if (isScalar) remote[key] = value;
    else local[key] = value;
  }
  return { remote, local };
}

module.exports = { matchesCriteria, filterRecords, sortRecords, applyOptions, splitCriteria };
