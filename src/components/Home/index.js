import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

class Home extends Component {
  randerHomeComponent = () => (
    <div className="home-container">
      <div className="text-container">
        <h1 className="home-title">Find The Job That Fits Your Life</h1>

        <p className="home-description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs" className="link">
          <button className="find-jobs-btn" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )

  render() {
    return (
      <div className="app-container">
        <Header className="header-container" />
        {this.randerHomeComponent()}
      </div>
    )
  }
}
export default Home
