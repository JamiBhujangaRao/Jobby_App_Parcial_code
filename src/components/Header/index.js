import {Component} from 'react'
import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'
import './index.css'

class Header extends Component {
  onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  render() {
    return (
      <nav className="nav-container">
        <img
          className="website-logo"
          alt="website logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        />
        <ul className="nav-items">
          <li className="each-nav">
            <Link to="/" className="link">
              Home
            </Link>
          </li>
          <li className="each-nav">
            <Link to="/jobs" className="link">
              Jobs
            </Link>
          </li>
        </ul>

        <button
          className="log-out-btn"
          type="button"
          onClick={this.onClickLogout}
        >
          Logout
        </button>
      </nav>
    )
  }
}
export default withRouter(Header)
