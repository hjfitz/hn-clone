import { h } from 'preact';
import { Link } from 'preact-router/match';

const links = [
  <li><Link activeClassName="active" href="/submit">Submit</Link></li>,
  <li><Link activeClassName="active" href="/">Home</Link></li>,
];

export default props => (
  <main>
    <nav>
      <div className="nav-wrapper">
        <Link href="/" className="brand-logo">Hockor Nows</Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {links}
        </ul>
      </div>
    </nav>
    <div className="container">
      {props.children}
    </div>
    <footer className="page-footer">
      <div className="container">
        <div className="row">
          <div className="col l6 s12">
            <h5 className="white-text">Hockor Nows</h5>
            <p className="grey-text text-lighten-4">
            A very poor clone by @hjfitz
            </p>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <div className="container">
            © 2018 Some Dude
        </div>
      </div>
    </footer>

  </main>
);

