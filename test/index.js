import mocha from 'mocha';
import chai from 'chai';
import createCrumbs from '../src';
import CrumbBuilder from '../src/CrumbBuilder';
import messages from '../src/messages';

chai.should();

const assertCrumb = ({name, href, icon}, expectedName, expectedHref, expectedIcon) => {
  name.should.equal(expectedName);
  href.should.equal(expectedHref);

  if (expectedIcon) {
    if (!icon)
      throw new Error(`Expected icon to be: ${expectedIcon}, but was null.`);
    else
      icon.should.equal(expectedIcon);
  }
};

describe('CrumbBuilder', () => {

  describe('.buildCrumb', () => {

    it('should throw when a parameter is missing', () => {

      var builder = new CrumbBuilder({param: '1'});
      var buildCrumb = () => builder.buildCrumb({name: 'test', path: '/a/:param/is/:target'});

      buildCrumb.should.throw(messages.parameterMissing('target'));
    });

    it('should throw when a parameter is null', () => {

      var builder = new CrumbBuilder({param: '1', target: null});
      var buildCrumb = () => builder.buildCrumb({name: 'test', path: '/a/:param/is/:target'});

      buildCrumb.should.throw(messages.parameterNotSet('target'));
    });

    it('should throw when a parameter is undefined', () => {

      var builder = new CrumbBuilder({param: '1', target: undefined});
      var buildCrumb = () => builder.buildCrumb({name: 'test', path: '/a/:param/is/:target'});

      buildCrumb.should.throw(messages.parameterNotSet('target'));
    });

    it('should throw when a parameter is empty', () => {

      var builder = new CrumbBuilder({param: '1', target: ''});
      var buildCrumb = () => builder.buildCrumb({name: 'test', path: '/a/:param/is/:target'});

      buildCrumb.should.throw(messages.parameterNotSet('target'));
    });

    it('should throw when passed a null route', () => {

      var builder = new CrumbBuilder({param: '1', target: ''});
      var buildCrumb = () => builder.buildCrumb();

      buildCrumb.should.throw(messages.invalidRoute);
    });

    it('should not throw when route path is missing.', () => {

      var builder = new CrumbBuilder({param: '1', target: ''});
      var buildCrumb = () => builder.buildCrumb({name: 'home'});

      buildCrumb.should.not.throw();
    });

    it('should throw when route breadCrumbTitle and name are missing.', () => {

      var builder = new CrumbBuilder({param: '1', target: ''});
      var buildCrumb = () => builder.buildCrumb({path: '/'});

      buildCrumb.should.throw(messages.routeNameMissing);
    });

    it('should build and collect a breadcrumb from a route.', () => {

      var builder = new CrumbBuilder({param: '1', target: '123'});
      builder.buildCrumb({breadCrumbTitle: 'View Widget', path: '/cat/:param/widget/:target', icon: 'widget'});

      builder.crumbs.should.be.an.instanceof(Array);
      builder.crumbs.should.have.length(1);

      assertCrumb(builder.crumbs[0], 'View Widget', '/cat/1/widget/123', 'widget');
    });

    it('will build and collect a breadcrumb from the root route. (eg. {path: \'\'})', () => {

      var builder = new CrumbBuilder({param: '1', target: '123'});
      builder.buildCrumb({breadCrumbTitle: 'HOME', path: '', icon: 'home'});

      builder.crumbs.should.be.an.instanceof(Array);
      builder.crumbs.should.have.length(1);

      assertCrumb(builder.crumbs[0], 'HOME', '/', 'home');
    });

  });

});

describe('createCrumbs', () => {

  it('should create href', () => {
    const props = {
      routes: [{name: 'test', path: '/store/:storeId/widgets/:widgetId/tags'}],
      params: {storeId: '666', widgetId: '668'}
    };

    const crumbs = createCrumbs(props);
    crumbs.should.be.an.instanceof(Array);
    crumbs.should.have.length(1);
    const crumb = crumbs[0];
    crumb.href.should.equal('/store/666/widgets/668/tags');
  });

  it('should create all crumbs [using route.name]', () => {
    const props = {
      routes: [
        {name: 'home', path: '/'},
        {name: 'inbox', path: 'inbox'},
        {name: 'message', path: 'messages/:message'},
        {name: 'replies', path: 'replies'},
        {name: 'reply', path: ':replyId'}
      ],
      params: {message: '345', replyId: '12'}
    };

    const crumbs = createCrumbs(props);
    crumbs.should.be.an.instanceof(Array);
    crumbs.should.have.length(5);

    assertCrumb(crumbs[0], 'home', '/');
    assertCrumb(crumbs[1], 'inbox', '/inbox');
    assertCrumb(crumbs[2], 'message', '/inbox/messages/345');
    assertCrumb(crumbs[3], 'replies', '/inbox/messages/345/replies');
    assertCrumb(crumbs[4], 'reply', '/inbox/messages/345/replies/12');
  });

  it('should create all crumbs [using route.breadCrumbTitle]', () => {
    const props = {
      routes: [
        {name: 'home', breadCrumbTitle: 'bc-home', path: '/'},
        {name: 'inbox', breadCrumbTitle: 'bc-inbox', path: 'inbox'},
        {name: 'message', breadCrumbTitle: 'bc-message', path: 'messages/:message'},
        {name: 'replies', breadCrumbTitle: 'bc-replies', path: 'replies'},
        {name: 'reply', breadCrumbTitle: 'bc-reply', path: ':replyId'}
      ],
      params: {message: '345', replyId: '12'}
    };

    const crumbs = createCrumbs(props);
    crumbs.should.be.an.instanceof(Array);
    crumbs.should.have.length(5);

    assertCrumb(crumbs[0], 'bc-home', '/');
    assertCrumb(crumbs[1], 'bc-inbox', '/inbox');
    assertCrumb(crumbs[2], 'bc-message', '/inbox/messages/345');
    assertCrumb(crumbs[3], 'bc-replies', '/inbox/messages/345/replies');
    assertCrumb(crumbs[4], 'bc-reply', '/inbox/messages/345/replies/12');
  });

});