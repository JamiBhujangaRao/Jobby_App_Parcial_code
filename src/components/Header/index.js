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
        <ul className="nav-items">
          <li className="each-nav">
            <Link to="/" className="route-link">
              <img
                className="website-logo"
                alt="website logo"
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              />
            </Link>
          </li>

          <li className="each-nav">
            <Link to="/" className="route-link">
              Home
            </Link>
            <Link to="/jobs" className="route-link">
              Jobs
            </Link>
          </li>
          <li className="each-nav">
            <button
              className="log-out-btn"
              type="button"
              onClick={this.onClickLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    )
  }
}
export default withRouter(Header)
