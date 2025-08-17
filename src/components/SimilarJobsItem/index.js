import {Component} from 'react'
import {Link} from 'react-router-dom'
import {GiRoundStar} from 'react-icons/gi'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

class SimilarJobsItem extends Component {
  render() {
    const {details} = this.props
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      rating,
      title,
    } = details
    return (
      <Link to={`/jobs/${id}`} className="link">
        <li className="similar-jobs">
          <div className="company-logo-container">
            <img
              className="company-logo"
              alt="similar job company logo"
              src={companyLogoUrl}
            />
            <div className="role-container">
              <h1 className="job-role">{title}</h1>
              <p className="rating">
                <GiRoundStar className="star-icon" /> {rating}
              </p>
            </div>
          </div>
          <h1 className="subtitle">Description</h1>
          <p className="job-desciption">{jobDescription}</p>
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
          </div>
        </li>
      </Link>
    )
  }
}

export default SimilarJobsItem
