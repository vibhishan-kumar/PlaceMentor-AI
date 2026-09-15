// University of Hyderabad email validation regex
export const UOHYD_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@uohyd\.ac\.in$/i;

/**
 * Validate University of Hyderabad student email
 * @param {string} email
 * @returns {boolean}
 */
export const isValidUoHEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return UOHYD_EMAIL_REGEX.test(email.trim());
};

/**
 * Validate registration input payload
 * @param {object} data
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export const validateRegistration = (data) => {
  const errors = [];
  const {
    name,
    email,
    password,
    confirmPassword,
    program,
    department,
    graduationYear
  } = data;

  if (!name || name.trim().length < 2) {
    errors.push('Full name is required (at least 2 characters).');
  }

  if (!email || !isValidUoHEmail(email)) {
    errors.push('Please use your University of Hyderabad email address ending with @uohyd.ac.in.');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.push('Passwords do not match.');
  }

  if (!program || program.trim().length === 0) {
    errors.push('Degree/Program is required (e.g., MCA, B.Tech, M.Tech).');
  }

  if (!department || department.trim().length === 0) {
    errors.push('Department is required (e.g., School of CIS).');
  }

  const currentYear = new Date().getFullYear();
  const gradYear = parseInt(graduationYear, 10);
  if (!gradYear || gradYear < currentYear - 5 || gradYear > currentYear + 10) {
    errors.push(`Please provide a valid graduation year (between ${currentYear - 5} and ${currentYear + 10}).`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate login input payload
 * @param {object} data
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export const validateLogin = (data) => {
  const errors = [];
  const { email, password } = data;

  if (!email || !isValidUoHEmail(email)) {
    errors.push('Please enter a valid @uohyd.ac.in university email address.');
  }

  if (!password) {
    errors.push('Password is required.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
