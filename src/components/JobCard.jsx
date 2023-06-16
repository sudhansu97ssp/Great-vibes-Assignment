import React, { useEffect } from "react";
import Netflix from "../assets/Netflix.svg";
import axios from "axios";

const JobCard = ({ jobData, setJobData, handleSingleJob, setIsEdit }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  const handleDeleteJob = async (id) => {
    try {
      const getResponse = await axios.delete(
        `https://648b1f3217f1536d65ea6b03.mockapi.io/api/v1/jobs/${id}`
      );
      if (getResponse.status === 200) {
        try {
          const getResponse = await axios.get(
            "https://648b1f3217f1536d65ea6b03.mockapi.io/api/v1/jobs"
          );
          if (getResponse.status === 200) {
            const getResult = getResponse.data;
            setJobData(getResult);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateJob = (id) => {
    handleSingleJob(id);
    setIsEdit(true);
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        height: "97%",
        overflowY: "auto",
      }}
    >
      {jobData?.map((job) => {
        return (
          <div
            key={job.id}
            style={{
              position: "relative",
              display: "flex",
              margin: "20px",
              backgroundColor: "#ffffff",
              width: "580px",
              height: "320px",
              left: "25px",
              marginBottom: "30px",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                className="bg-blue-500 shadow-sm rounded-md text-white cursor-pointer"
                style={{ height: "30px", width: "68px" }}
                onClick={() => handleUpdateJob(job.id)}
              >
                Edit
              </button>
              <button
                className="bg-blue-500 shadow-sm rounded-md text-white cursor-pointer"
                style={{ height: "30px", width: "78px" }}
                onClick={() => handleDeleteJob(job?.id)}
              >
                Delete
              </button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                top: "10px",
                left: "10px",
                position: "relative",
                gap: "8px",
              }}
            >
              <img src={Netflix} alt="Netflix" />
              <div>
                <div
                  style={{
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "24px",
                    lineHeight: "32px",
                  }}
                >
                  {job?.job_title}
                </div>
                <div>
                  {job?.company_name} - {job?.industry}
                </div>
                <div style={{ color: "#7A7A7A" }}>
                  {job?.location} ({job?.remote_type})
                </div>
                <div style={{ marginTop: "24px" }}>
                  Part-Time (9.00 am - 5.00 pm IST)
                </div>
                <div style={{ marginTop: "8px" }}>
                  Experience ({job?.experience_min} - {job?.experience_max}{" "}
                  years)
                </div>
                <div style={{ marginTop: "8px" }}>
                  INR (₹) {job?.salary_min} - {job?.salary_max} / Month
                </div>
                <div style={{ marginTop: "8px" }}>
                  {job?.total_employee} employees
                </div>
                <div style={{ marginTop: "24px" }}>
                  <button
                    className=" shadow-sm rounded-md  cursor-pointer"
                    style={{
                      height: "40px",
                      width: "158px",
                      backgroundColor:
                        job?.apply_type === "Quick apply"
                          ? "#1597E4"
                          : "#ffffff",
                      color:
                        job?.apply_type === "Quick apply"
                          ? "#ffffff"
                          : "#1597E4",
                      borderColor:
                        job?.apply_type === "Quick apply" ? "none" : "#1597E4",
                    }}
                  >
                    {job.apply_type}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobCard;
