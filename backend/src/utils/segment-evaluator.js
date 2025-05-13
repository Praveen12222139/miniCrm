/**
 * Evaluates if a customer matches the given segment rules
 * @param {Object} customer - Customer object
 * @param {Object} rules - Segment rules
 * @returns {boolean} - Whether the customer matches the rules
 */
function evaluateSegmentRules(customer, rules) {
  if (rules.operator === 'AND') {
    return rules.conditions.every(condition => evaluateCondition(customer, condition));
  } else if (rules.operator === 'OR') {
    return rules.conditions.some(condition => evaluateCondition(customer, condition));
  }
  return evaluateCondition(customer, rules);
}

/**
 * Evaluates a single condition against a customer
 * @param {Object} customer - Customer object
 * @param {Object} condition - Single condition object
 * @returns {boolean} - Whether the customer matches the condition
 */
function evaluateCondition(customer, condition) {
  const value = customer[condition.field];
  
  switch (condition.operator) {
    case '>':
      return value > condition.value;
    case '<':
      return value < condition.value;
    case '>=':
      return value >= condition.value;
    case '<=':
      return value <= condition.value;
    case '=':
    case '==':
      return value == condition.value;
    case '!=':
      return value != condition.value;
    case 'contains':
      return value.includes(condition.value);
    case 'not_contains':
      return !value.includes(condition.value);
    case 'in':
      return condition.value.includes(value);
    case 'not_in':
      return !condition.value.includes(value);
    case 'between':
      return value >= condition.value[0] && value <= condition.value[1];
    case 'inactive_for':
      const inactiveDays = Math.floor((Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24));
      return inactiveDays >= condition.value;
    default:
      throw new Error(`Unknown operator: ${condition.operator}`);
  }
}

module.exports = {
  evaluateSegmentRules
};
