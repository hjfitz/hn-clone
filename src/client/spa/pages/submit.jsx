import { h, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';

class Submit extends Component {
  submit() {
    const { value: title } = this.title;
    const { value: url } = this.url;
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) route('/login', true);
    console.log('submitting');
    axios.post('/api/story', { title, url }, { headers: { token } }).then(() => route('/', true));
  }

  render() {
    return (
      <section>
        <div className="row">
          <form className="col s12">
            <div className="input-field col s6">
              <input id="title" type="text" className="validate" ref={(i) => { this.title = i; }} />
              <label htmlFor="title">Title</label>
            </div>
            <div className="input-field col s6">
              <input id="url" type="text" className="validate" ref={(i) => { this.url = i; }} />
              <label htmlFor="url">URL</label>
            </div>
            <div className="row">
              <a className="waves-effect waves-light btn" href="#!" onClick={this.submit.bind(this)}>Submit</a>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default Submit;
