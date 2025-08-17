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
    this.setState({profileStatus: apistatus.inProcess})
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
    console.log(response)
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
    this.getProfileData()
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
        <h1 className="name">{profileDetails.name}</h1>
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

  renderInProcess = () => (
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
    <ul className="employmentType-filters">
      {list.map(each => (
        <li className="each-list" key={each.employmentTypeId}>
          <input
            className="filter-input"
            type="checkbox"
            id={each.employmentTypeId}
            value={each.employmentTypeId}
            name="empoment_type"
            onChange={this.onChangeEmp}
          />
          <label className="label" htmlFor={each.employmentTypeId} key="label">
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderPackageFilter = list => (
    <ul className="salaryRange-filters">
      {list.map(each => (
        <li className="each-list" key={each.salaryRangeId}>
          <input
            className="filter-input"
            type="radio"
            id={each.salaryRangeId}
            value={each.salaryRangeId}
            onChange={this.onChangeSalery}
            name="package"
          />
          <label className="label" htmlFor={each.salaryRangeId} key="label">
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
        <div className="profil-seaction">{this.renderProfileDetails()}</div>
        <hr className="hr" />
        <div className="filter-container">
          <div className="container">
            <h1 className="filter-title">Type of Employment</h1>
            {this.renderEmploymentFilter(employmentTypesList)}
          </div>
          <hr />
          <h1 className="filter-title">Salary Range</h1>
          <div className="container">
            {this.renderPackageFilter(salaryRangesList)}
          </div>
        </div>
      </div>
    )
  }
}
export default JobFilters
