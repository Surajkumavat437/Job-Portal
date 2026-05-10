import React from 'react'
import JobCard from './JobCard.jsx'

const JobList = ({jobs}) => {
  return (
   <div className="flex flex-col gap-4">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  )
}

export default JobList;