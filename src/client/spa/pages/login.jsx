import { h, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import M from 'materialize-css';

function isEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

class Login extends Component {
  componentDidMount() {
    M.updateTextFields();
  }

  get creds() {
    const { value: email } = this.email;
    const { value: pass } = this.pass;
    if (email && pass && isEmail(email)) return { email, pass };
    return false;
  }

  async login() {
    const { creds } = this;
    console.log(creds);
    if (!creds) return; // eventually show error
    try {
      const resp = await axios.post('/api/login', creds);
      const token = resp.data;
      console.log(token);
      localStorage.setItem('token', JSON.stringify(token));
    } catch (err) {
      console.log(err);
    }
  }

  async signup() {
    localStorage.removeItem('token');
    const { creds } = this;
    if (!creds) return;
    try {
      const { data: token } = await axios.post('/api/signup', creds);
      localStorage.setItem('token', JSON.stringify(token));
    } catch (err) {
      console.log(err);
    }
  }


  render() {
    return (
      <section>
        <div className="row">
          <form className="col s12">
            <div className="input-field col s6">
              <input id="email" type="email" className="validate" ref={(i) => { this.email = i; }} />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-field col s6">
              <input id="pass" type="password" className="validate" required ref={(i) => { this.pass = i; }} />
              <label htmlFor="pass" required>Password</label>
            </div>
            <div className="row">
              <a className="waves-effect waves-light btn" href="#!" onClick={this.login.bind(this)}>Login</a>
            </div>
            <div className="row">
              <a className="waves-effect waves-light btn" href="#!" onClick={this.signup.bind(this)}>Sign Up</a>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default Login;
