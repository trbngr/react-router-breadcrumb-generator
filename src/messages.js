export default {
  parameterMissing: (param) => `Missing router parameter: '${param}'`,
  parameterNotSet: (param) => `Router parameter '${param}' is not set.`,
  routeNameMissing: `Route is missing both 'breadCrumbTitle' and 'name'. One of them are required.`,
  invalidRoute: 'Invalid route.'
}