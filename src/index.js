import CrumbBuilder from './CrumbBuilder';

export default ({routes, params}) => {

  return routes.filter(x => x.hasOwnProperty('name') || x.hasOwnProperty('breadCrumbTitle'))
    .reduce((builder, route) => builder.buildCrumb(route), new CrumbBuilder(params))
    .crumbs;

};