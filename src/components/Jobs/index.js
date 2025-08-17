import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Header from '../Header'
import JobFilters from '../JobFilters'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apistatus = {
  intial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProcess: 'IN_PROCESS',
}
class Jobs extends Component {
  state = {
    jobSearchInput: '',
    typeofEmployment: [],
    saleryRange: '',
    jobsPageStatus: apistatus.intial,
    jobsList: [],
  }

  componentDidMount() {
    this.getJobsData()
  }

  getUrl = () => {
    const {typeofEmployment, saleryRange, jobSearchInput} = this.state
    const filterdEmployemet = typeofEmployment.join(',')
    const filterdUrl = `employment_type=${filterdEmployemet}&minimum_package=${saleryRange}&search=${jobSearchInput}`
    return filterdUrl
  }

  onSuccessFullFetch = data => {
    this.setState({jobsList: data, jobsPageStatus: apistatus.success})
  }

  onFailureFetch = () => {
    this.setState({jobsPageStatus: apistatus.failure})
  }

  getJobsData = async () => {
    this.setState({jobsPageStatus: apistatus.inProcess})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?${this.getUrl()}`
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
      const structuredDate = jsonData.jobs.map(each => this.formattedData(each))
      this.onSuccessFullFetch(structuredDate)
    } else {
      this.onFailureFetch()
    }
  }

  formattedData = eachJob => {
    const formattedJob = {
      companyLogoUrl: eachJob.company_logo_url,
      employmentType: eachJob.employment_type,
      id: eachJob.id,
      jobDescription: eachJob.job_description,
      location: eachJob.location,
      packagePerAnnum: eachJob.package_per_annum,
      rating: eachJob.rating,
      title: eachJob.title,
    }
    return formattedJob
  }

  onRetry = () => {
    this.getJobsData()
  }

  onChangeEmployment = value => {
    this.setState(prevState => {
      const alreadySelectd = prevState.typeofEmployment.includes(value)
      const upDatedList = alreadySelectd
        ? prevState.typeofEmployment.filter(each => each !== value)
        : [...prevState.typeofEmployment, value]
      return {typeofEmployment: upDatedList}
    }, this.getJobsData)
  }

  onChangePackage = value => {
    this.setState({saleryRange: value}, this.getJobsData)
  }

  renderNoJobs = () => (
    <div className="no-jobs-container">
      <img
        className="no-jobs-image"
        alt="no jobs"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
      />
      <h1 className="no-jobs-title">No Jobs Found</h1>
      <p className="about">We could not find any jobs. Try other filters.</p>
    </div>
  )

  renderSuccessView = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return this.renderNoJobs()
    }
    return (
      <ul className="un-jobs-list">
        {jobsList.map(each => (
          <JobItem jobDetails={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderProfileAndFilter = () => (
    <JobFilters
      employmentTypesList={employmentTypesList}
      salaryRangesList={salaryRangesList}
      onChangeEmployment={this.onChangeEmployment}
      onChangePackage={this.onChangePackage}
    />
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-view-image"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1 className="failure-view-title">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for
      </p>
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

  onChangeSeachInput = event => {
    this.setState({jobSearchInput: event.target.value})
  }

  onSearchJobsOnInput = () => {
    this.getJobsData()
  }

  renderJobsSection = () => {
    const {jobsPageStatus} = this.state
    switch (jobsPageStatus) {
      case apistatus.success:
        return this.renderSuccessView()
      case apistatus.failure:
        return this.renderFailureView()
      case apistatus.inProcess:
        return this.renderInProcessView()
      default:
        return null
    }
  }

  render() {
    const {jobSearchInput, typeofEmployment} = this.state
    console.log(typeofEmployment)

    return (
      <div className="jobs-page">
        <Header />
        <div className="jobs-section">
          <div className="filters-container">
            {this.renderProfileAndFilter()}
          </div>
          <div className="jobs-container">
            <div className="search-container">
              <input
                type="search"
                className="job-search"
                value={jobSearchInput}
                placeholder="Search"
                onChange={this.onChangeSeachInput}
              />
              <button
                className="search-icon-container"
                data-testid="searchButton"
                type="button"
                onClick={this.onSearchJobsOnInput}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsSection()}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
