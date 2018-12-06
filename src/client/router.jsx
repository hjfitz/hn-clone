import { h, render } from 'preact';
import Router from 'preact-router';
import 'materialize-css/sass/materialize.scss';


import { Home, Profile, Story, Submit, Login } from './spa/Pages';
import Layout from './spa/layout';
import './root.scss';

/**
 * Routes are far nicer in Preact
 * Add your component under the router and give it a 'path' prop
 * @example
 *   <Router>
 *     <MyNewComponent path="/my/custom/route" />
 *   </Router>
 */
render(
  (
    <Layout>
      <Router>
        <Home path="/" />
        <Login path="/login" />
        <Submit path="/submit" />
        <Story path="/story/:id" />
        <Profile path="/profile/:user" />
      </Router>
    </Layout>
  ), document.body,
);
