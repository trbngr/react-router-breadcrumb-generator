import invariant from 'invariant';
import messages from './messages';

const parameterMatcher = /:(.+)/;

function makeUri(builder, route) {
  return (route.path || '')
    .split('/')
    .reduce((href, part) => `${href}/${transformRoutePart(builder, part)}`, builder._href)
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
    this._href = '';
    this._params = params;
    this._crumbs = [];
  }

  buildCrumb(route) {

    invariant(route, messages.invalidRoute);
    invariant(route.breadCrumbTitle || route.name, messages.routeNameMissing);

    this._href = makeUri(this, route);

    this._crumbs.push({
      name: route.breadCrumbTitle || route.name,
      icon: route.icon,
      href: this._href
    });

    return this;
  }

  get crumbs() {
    return this._crumbs;
  }
}