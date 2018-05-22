import { h, render } from 'preact';
import Router from 'preact-router';
import 'materialize-css/sass/materialize.scss';


import { Home, Profile, Story, Submit } from './spa/Pages';
import Layout from './spa/layout';
import './style.scss';

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
        <Profile path="/profile/:user" />
        <Story path="/story/:id" />
        <Submit path="/submit" />
      </Router>
    </Layout>
  ), document.body,
);
