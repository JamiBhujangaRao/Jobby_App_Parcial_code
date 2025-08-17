import {Component} from 'react'
import {Link} from 'react-router-dom'
import {GiRoundStar} from 'react-icons/gi'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

class JobItem extends Component {
  render() {
    const {jobDetails} = this.props
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails
    return (
      <Link to={`/jobs/${id}`} className="link">
        <li className="each-job">
          <div className="company-logo-container">
            <img
              className="company-logo"
              alt="company logo"
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
          <h1 className="subtitle">Description</h1>
          <p className="job-desciption">{jobDescription}</p>
        </li>
      </Link>
    )
  }
}

export default JobItem
