const validateParams = (params, permitedParams) => {
  const paramsArray = Object.keys(params)
  const hasValidParams = paramsArray.every( param => permitedParams.includes(param))
  return hasValidParams
}

module.exports = validateParams