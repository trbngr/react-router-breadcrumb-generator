import invariant from 'invariant';
import messages from './messages';

const parameterMatcher = /:(.+)/;

function makeUri(builder, route) {
  return (route.path || '')
    .split('/')
    .reduce((uri, part) => `${uri}/${transformRoutePart(builder, part)}`, builder._uri)
    .replace('//', '/');
}

function transformRoutePart(builder, part) {

  const match = parameterMatcher.exec(part);

  if (match == null) {
    return part;
  }

  var params = builder._params;

  const paramName = match[1];

  invariant(params.hasOwnProperty(paramName), messages.parameterMissing(paramName));

  const param = params[paramName];

  invariant(param, messages.parameterNotSet(paramName));

  return param;
}


export default class {

  /** @namespace route.breadCrumbTitle */

  constructor(params = {}) {
    this._uri = '';
    this._params = params;
    this._crumbs = [];
  }

  buildCrumb(route) {

    invariant(route, messages.invalidRoute);
    invariant(route.breadCrumbTitle || route.name, messages.routeNameMissing);

    this._uri = makeUri(this, route);

    this._crumbs.push({
      name: route.breadCrumbTitle || route.name,
      icon: route.icon,
      uri: this._uri
    });

    return this;
  }

  get crumbs() {
    return this._crumbs;
  }
}