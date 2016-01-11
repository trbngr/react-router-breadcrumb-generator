export default {
  parameterMissing: (param) => `Missing router parameter: '${param}'`,
  parameterNotSet: (param) => `Router parameter '${param}' is not set.`,
  routePathMissing: `Route is missing the required property: 'path'`,
  routeNameMissing: `Route is missing both 'breadCrumbTitle' and 'name'. One of them are required.`,
  invalidRoute: 'Invalid route.'
}