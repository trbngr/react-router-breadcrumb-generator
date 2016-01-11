# react-router Breadcrumb Generator
Creates breadcrumb objects from the current route. 

This library doesn't not render anything. It simply returns objects that you can render yourself.

#Installation
`npm i --save react-router-breadcrumb-generator`

##API
`const crumbs = CreateCrumbs({routes, params});`

Returns an array of breadcrumb objects with the following shape:
```
{
  name: '',
  icon: '',
  href: ''
}
```

##Usage

Decorate your routes with a `breadCrumbTitle` (will fallback to `name` if not given) and an optional `icon`.

`<Route path='widget/:widgetId' breadCrumbTitle='View Widget' icon='settings' />`

bread-crumbs.js
```
import React from 'react';

import {Row} from 'react-flexbox-grid';
import {Link} from 'react-router';
import {FontIcon} from 'react-toolbox';

import CreateCrumbs from 'react-router-breadcrumb-generator';

import style from './BreadCrumbs.scss';

const BreadCrumbs = (props) => {

  const crumbs = CreateCrumbs(props)
    .map((crumb, index) => (
      <Link key={index} to={crumb.href} className={style.item}>
        {props.icons && crumb.icon && <FontIcon value={crumb.icon}/>}
        {crumb.name}
      </Link>
    ));

  return (
    <Row {...props} className={style.container}>
      {crumbs}
    </Row>
  );
};

BreadCrumbs.propTypes = {
  routes: React.PropTypes.array.isRequired,
  params: React.PropTypes.object.isRequired,
  icons: React.PropTypes.bool
};

BreadCrumbs.defaultProps = {
  icons: false
};

export default BreadCrumbs;
```
