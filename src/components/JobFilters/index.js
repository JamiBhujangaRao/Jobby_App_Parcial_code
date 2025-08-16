import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apistatus = {
  intial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProcess: 'IN_PROCESS',
}
class JobFilters extends Component {
  state = {profileDetails: {}, profileStatus: apistatus.intial}

  componentDidMount() {
    this.getProfileData()
  }

  onSuccessFullFetch = data => {
    this.setState({profileDetails: data, profileStatus: apistatus.success})
  }

  onFailureFetch = () => {
    this.setState({profileStatus: apistatus.failure})
  }

  getProfileData = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const jsonData = await response.json()
      const structuredDate = {
        name: jsonData.profile_details.name,
        profileImageUrl: jsonData.profile_details.profile_image_url,
        shortBio: jsonData.profile_details.short_bio,
      }

      this.onSuccessFullFetch(structuredDate)
    } else {
      this.onFailureFetch()
    }
  }

  onRetry = () => {
    const {history} = this.props
    history.replace('/jobs')
  }

  renderProfileView = () => {
    const {profileDetails} = this.state
    return (
      <div className="profile-container">
        <img
          className="profile-pic"
          alt="profile"
          src={profileDetails.profileImageUrl}
        />
        <p className="name">{profileDetails.name}</p>
        <p className="bio">{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderFailure = () => (
    <div className="failure-profile-container">
      <button className="retry-btn" type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderInProcessView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileDetails = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case apistatus.success:
        return this.renderProfileView()
      case apistatus.failure:
        return this.renderFailure()
      case apistatus.inProcess:
        return this.renderInProcess()
      default:
        return null
    }
  }

  onChangeEmp = event => {
    const {onChangeEmployment} = this.props
    onChangeEmployment(event.target.value)
    console.log(event.target.value)
  }

  onChangeSalery = event => {
    const {onChangePackage} = this.props
    onChangePackage(event.target.value)
    console.log(event.target.value)
  }

  renderEmploymentFilter = list => (
    <ul className="filters">
      {list.map(each => (
        <li className="each-list">
          <input
            className="filter-input"
            type="checkbox"
            id={each.employmentTypeId}
            value={each.employmentTypeId}
            name="empoment_type"
            onChange={this.onChangeEmp}
          />
          <label className="label" htmlFor={each.id}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderPackageFilter = list => (
    <ul className="filters">
      {list.map(each => (
        <li className="each-list">
          <input
            className="filter-input"
            type="radio"
            id={each.id}
            value={each.salaryRangeId}
            onChange={this.onChangeSalery}
            name="package"
          />
          <label className="label" htmlFor={each.id}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  render() {
    const {employmentTypesList, salaryRangesList} = this.props
    return (
      <div className="filter-section">
        {this.renderProfileDetails()}
        <hr />
        <div className="filter-container">
          <div className="container">
            <p className="filter-title">Type of Employment</p>
            {this.renderEmploymentFilter(employmentTypesList)}
            <hr />
          </div>

          <div className="container">
            <p className="filter-title">Salery Package</p>
            {this.renderPackageFilter(salaryRangesList)}
          </div>
        </div>
      </div>
    )
  }
}
export default JobFilters
