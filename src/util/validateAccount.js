const validateAccountName = (accountName, accountNameDb) =>
  accountName == accountNameDb ? true : false
const validatePassword = (password, passwordDb) =>
  password == passwordDb ? true : false

module.exports = {
  validateAccountName,
  validatePassword,
}
