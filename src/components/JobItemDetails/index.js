import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaExternalLinkAlt} from 'react-icons/fa'
import {GiRoundStar} from 'react-icons/gi'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Header from '../Header'
import SimilarJobsItem from '../SimilarJobsItem'
import './index.css'

const detailsStatus = {
  initial: 'INITIAL',
  inProcess: 'IN_PROCESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: [],
    similarJobsList: {},
    jobDetailsStatus: detailsStatus.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  formattedJobDetails = eachJob => {
    const formattedJob = {
      companyLogoUrl: eachJob.company_logo_url,
      companyWebsiteUrl: eachJob.company_website_url,
      employmentType: eachJob.employment_type,
      id: eachJob.id,
      jobDescription: eachJob.job_description,
      title: eachJob.title,
      location: eachJob.location,
      rating: eachJob.rating,
      packagePerAnnum: eachJob.package_per_annum,
      lifeAtCompany: {
        imageUrl: eachJob.life_at_company.image_url,
        description: eachJob.life_at_company.description,
      },
      skills: eachJob.skills.map(each => this.getFormattedSkills(each)),
    }
    return formattedJob
  }

  formatedSimialrJobs = eachJob => {
    const simiarJobs = {
      companyLogoUrl: eachJob.company_logo_url,
      employmentType: eachJob.employment_type,
      id: eachJob.id,
      jobDescription: eachJob.job_description,
      title: eachJob.title,
      location: eachJob.location,
      rating: eachJob.rating,
    }
    return simiarJobs
  }

  getFormattedSkills = skill => {
    const formmatedSkill = {
      name: skill.name,
      imageUrl: skill.image_url,
    }
    return formmatedSkill
  }

  getJobDetails = async () => {
    this.setState({jobDetailsStatus: detailsStatus.inProcess})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
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
      console.log(jsonData)
      const stucturedJobDetails = this.formattedJobDetails(jsonData.job_details)
      const stucturedSimilarJobs = jsonData.similar_jobs.map(each =>
        this.formatedSimialrJobs(each),
      )
      this.setState({
        jobDetails: stucturedJobDetails,
        similarJobsList: stucturedSimilarJobs,
        jobDetailsStatus: detailsStatus.success,
      })
    } else {
      this.setState({jobDetailsStatus: detailsStatus.failure})
    }
  }

  renderInprocess = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetry = () => {
    this.getJobDetails()
  }

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

  renderOnSuccessView = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      title,
      lifeAtCompany,
      skills,
      location,
      rating,
      packagePerAnnum,
    } = jobDetails

    return (
      <>
        <div className="each-jobItem-details">
          <div className="company-logo-container">
            <img
              className="company-logo"
              alt="job details company logo"
              src={companyLogoUrl}
            />
            <div className="role-container">
              <h1 className="job-role">{title}</h1>
              <p className="rating">
                <GiRoundStar className="star-icon" /> {rating}
              </p>
            </div>
          </div>
          <div className="job-details-container">
            <div className="job-type-location-container">
              <div className="location-container">
                <MdLocationOn className="icons" />
                <p className="location">{location}</p>
              </div>
              <div className="job-type-container">
                <BsFillBriefcaseFill className="icons" />
                <p className="job-type">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <div className="visit-container">
            <h1 className="subtitle">Description</h1>
            <a
              href={companyWebsiteUrl}
              className="company-url"
              rel="noreferrer"
              target="_blank"
            >
              <p className="vist">Visit</p>
              <FaExternalLinkAlt className="visit-link" />
            </a>
          </div>
          <p className="job-desciption">{jobDescription}</p>

          <h1 className="subtitle">Skills</h1>
          <ul className="skills-container">
            {skills.map(each => (
              <li className="each-skill" key={each.name}>
                <img
                  className="skill-image"
                  alt={each.name}
                  src={each.imageUrl}
                />
                <h1 className="skill-name">{each.name}</h1>
              </li>
            ))}
          </ul>

          <h1 className="subtitle">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="description">{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
        <h1 className="simiar-jobs-title">Similar jobs</h1>
        <div className="simiar-jobs-seaction">{this.renderSimilarJobs()}</div>
      </>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobsList} = this.state
    return (
      <ul className="ul-simiar-jobs-container">
        {similarJobsList.map(each => (
          <SimilarJobsItem details={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderJobDetailsItem = () => {
    const {jobDetailsStatus} = this.state
    switch (jobDetailsStatus) {
      case detailsStatus.inProcess:
        return this.renderInprocess()
      case detailsStatus.success:
        return this.renderOnSuccessView()
      case detailsStatus.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-item-details-container">
        <Header />
        <div className="job-details-seaction">
          {this.renderJobDetailsItem()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails
