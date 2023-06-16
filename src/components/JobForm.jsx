import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import classes from "./JobForm.module.css";
import { Dialog, DialogContent } from "@mui/material";
import axios from "axios";
import JobCard from "./JobCard";

const JobForm = () => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [open, setOpen] = useState(false);
  const [singleJobData, setSingleData] = useState({});
  const [jobData, setJobData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const validationSchema = yup.object({
    job_title: yup.string().required("Job title Required"),
    company_name: yup.string().required("Company Name Required"),
    industry: yup.string().required("Industry field required"),
    location: yup.string().required("Location of Job Required"),
    remote_type: yup.string().required("Type job is Required"),
    experience_min: yup.string().required("Minimum Experience Required"),
    experience_max: yup.string().required("Maximum Experience Required"),
    salary_min: yup.string().required("Minimum Salary Required"),
    salary_max: yup.string().required("Maximum Salary Required"),
    total_employee: yup.string().required("Total Employee of Company Required"),
    // apply_type: yup.string().required(),
  });

  useEffect(() => {
    const getJobData = async () => {
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
    };
    getJobData();
  }, []);

  const handleSingleJob = async (id) => {
    try {
      const getResponse = await axios.get(
        `https://648b1f3217f1536d65ea6b03.mockapi.io/api/v1/jobs/${id}`
      );
      if (getResponse.status === 200) {
        setSingleData(getResponse.data);
        setOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(singleJobData);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      job_title: singleJobData?.job_title || "",
      company_name: singleJobData?.company_name || "",
      industry: singleJobData?.industry || "",
      location: singleJobData?.location || "",
      remote_type: singleJobData?.remote_type || "",
      experience_min: singleJobData?.experience_min || "",
      experience_max: singleJobData?.experience_max || "",
      salary_min: singleJobData?.salary_min || "",
      salary_max: singleJobData?.salary_max || "",
      total_employee: singleJobData?.total_employee || "",
      apply_type: singleJobData?.apply_type || "",
    },
    onSubmit: (values) => {
      handleCreateJob();
      setCurrentScreen(1);
    },
  });

  const handleCreateJob = async () => {
    if (!isEdit) {
      try {
        const postResponse = await axios.post(
          "https://648b1f3217f1536d65ea6b03.mockapi.io/api/v1/jobs",
          formik.values
        );
        if (postResponse.status === 201) {
          // Make the GET request after the POST request succeeds
          const getResponse = await axios.get(
            "https://648b1f3217f1536d65ea6b03.mockapi.io/api/v1/jobs"
          );

          // Check if the GET request was successful
          if (getResponse.status === 200) {
            const getResult = getResponse.data;
            setJobData(getResult);
            setOpen(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const postResponse = await axios.put(
          `https://648b1f3217f1536d65ea6b03.mockapi.io/api/v1/jobs/${singleJobData.id}`,
          formik.values
        );
        if (postResponse.status === 200) {
          // Make the GET request after the POST request succeeds
          const getResponse = await axios.get(
            "https://648b1f3217f1536d65ea6b03.mockapi.io/api/v1/jobs"
          );

          // Check if the GET request was successful
          if (getResponse.status === 200) {
            const getResult = getResponse.data;
            setJobData(getResult);
            setOpen(false);
            setIsEdit(false);
            setCurrentScreen(1);
            setSingleData({});
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div>
        <button
          className="relative bg-blue-500 shadow-sm rounded-md text-white cursor-pointer"
          style={{
            height: "40px",
            width: "98px",
            top: "10px",
            left: "30px",
            outline: "none",
          }}
          onClick={() => setOpen(true)}
        >
          Create Job
        </button>
        <div
          style={{
            width: "1300px",
            height: "748px",
            backgroundColor: "#D8D8D8",
            position: "relative",
            left: "70px",
            top: "20px",
          }}
        >
          <JobCard
            jobData={jobData}
            setJobData={setJobData}
            handleSingleJob={handleSingleJob}
            setIsEdit={setIsEdit}
          />
        </div>
      </div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setIsEdit(false);
          formik.resetForm();
        }}
      >
        <DialogContent style={{ height: "564px" }}>
          <div className="relative w-full h-full">
            <div className="flex justify-between font-poppins font-normal text-base leading-7">
              <h4>Create a Job</h4>
              {currentScreen === 1 ? (
                <p className="font-poppins font-medium text-base leading-6">
                  Step 1
                </p>
              ) : (
                <p className="font-poppins font-medium text-base leading-6">
                  Step 2
                </p>
              )}
            </div>
            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              {currentScreen === 1 ? (
                <>
                  <div className="flex flex-col mt-6 font-poppins font-medium text-sm leading-5">
                    <label htmlFor="job_title">Job Title</label>
                    <input
                      type="text"
                      id="job_title"
                      name="job_title"
                      placeholder="ex. UX UI Designer"
                      value={formik.values.job_title}
                      onChange={formik.handleChange}
                      className="border border-gray-300 bg-white rounded-lg"
                      style={{
                        marginTop: "4px",
                        height: "36px",
                      }}
                    />
                    {formik.errors.job_title && (
                      <div className={classes.pushStarters_ErrorMessage}>
                        {formik.errors.job_title}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col mt-6 font-poppins font-medium text-sm leading-5">
                    <label htmlFor="company_name">Company name</label>
                    <input
                      type="text"
                      id="company_name"
                      name="company_name"
                      value={formik.values.company_name}
                      placeholder="ex. Google"
                      onChange={formik.handleChange}
                      className="border border-gray-300 bg-white rounded-lg"
                      style={{
                        marginTop: "4px",
                        height: "36px",
                      }}
                    />
                    {formik.errors.company_name && (
                      <div className={classes.pushStarters_ErrorMessage}>
                        {formik.errors.company_name}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col mt-6 font-poppins font-medium text-sm leading-5">
                    <label htmlFor="industry">Industry</label>
                    <input
                      type="text"
                      id="industry"
                      name="industry"
                      placeholder="ex. Information Technology"
                      value={formik.values.industry}
                      onChange={formik.handleChange}
                      className="border border-gray-300 bg-white rounded-lg"
                      style={{
                        marginTop: "4px",
                        height: "36px",
                      }}
                    />
                    {formik.errors.industry && (
                      <div className={classes.pushStarters_ErrorMessage}>
                        {formik.errors.industry}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className="flex flex-col mt-6 font-poppins font-medium text-sm leading-5">
                      <label htmlFor="location">Location</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="ex. Chennai"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        className="border border-gray-300 bg-white rounded-lg"
                        style={{
                          marginTop: "4px",
                          height: "36px",
                          width: "17vw",
                        }}
                      />
                      {formik.errors.location && (
                        <div className={classes.pushStarters_ErrorMessage}>
                          {formik.errors.location}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col mt-6 font-poppins font-medium text-sm leading-5">
                      <label htmlFor="remote_type">Remote Type</label>
                      <input
                        type="text"
                        id="remote_type"
                        name="remote_type"
                        value={formik.values.remote_type}
                        placeholder="ex. In-office"
                        onChange={formik.handleChange}
                        className="border border-gray-300 bg-white rounded-lg"
                        style={{
                          marginTop: "4px",
                          height: "36px",
                          width: "17vw",
                        }}
                      />
                      {formik.errors.remote_type && (
                        <div className={classes.pushStarters_ErrorMessage}>
                          {formik.errors.remote_type}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex relative justify-end top-20">
                    <button
                      disabled={
                        formik.values.job_title === "" ||
                        formik.values.company_name === "" ||
                        formik.values.industry === "" ||
                        formik.values.location === "" ||
                        formik.values.remote_type === ""
                      }
                      className="bg-blue-500 shadow-sm rounded-md text-white cursor-pointer"
                      onClick={() => setCurrentScreen(currentScreen + 1)}
                      style={{
                        height: "40px",
                        width: "68px",
                        opacity:
                          formik.values.job_title === "" ||
                          formik.values.company_name === "" ||
                          formik.values.industry === "" ||
                          formik.values.location === "" ||
                          formik.values.remote_type === ""
                            ? 0.5
                            : 1,
                      }}
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col mt-6 font-poppins font-medium text-sm leading-5">
                    <label htmlFor="experience">Experience</label>
                    <div className="flex mt-1 justify-between font-poppins font-medium text-sm leading-5">
                      <div>
                        <input
                          type="text"
                          id="minimum"
                          style={{ width: "17vw", height: "36px" }}
                          name="experience_min"
                          value={formik.values.experience_min}
                          className="border border-gray-300 bg-white rounded-lg"
                          placeholder="Minimum"
                          onChange={formik.handleChange}
                        />
                        {formik.errors.experience_min && (
                          <div className={classes.pushStarters_ErrorMessage}>
                            {formik.errors.experience_min}
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          id="maximum"
                          style={{ width: "17vw", height: "36px" }}
                          name="experience_max"
                          placeholder="Maximum"
                          value={formik.values.experience_max}
                          className="border border-gray-300 bg-white rounded-lg"
                          onChange={formik.handleChange}
                        />
                        {formik.errors.experience_max && (
                          <div className={classes.pushStarters_ErrorMessage}>
                            {formik.errors.experience_max}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col mt-6 font-poppins font-medium text-sm leading-5">
                    <label htmlFor="Salary">Salary</label>
                    <div className="flex mt-1 justify-between font-poppins font-medium text-sm leading-5">
                      <div>
                        <input
                          type="text"
                          id="minimum"
                          style={{ width: "17vw", height: "36px" }}
                          name="salary_min"
                          placeholder="Minimum"
                          value={formik.values.salary_min}
                          className="border border-gray-300 bg-white rounded-lg"
                          onChange={formik.handleChange}
                        />
                        {formik.errors.salary_min && (
                          <div className={classes.pushStarters_ErrorMessage}>
                            {formik.errors.salary_min}
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          id="maximum"
                          style={{ width: "17vw", height: "36px" }}
                          name="salary_max"
                          placeholder="Maximum"
                          value={formik.values.salary_max}
                          className="border border-gray-300 bg-white rounded-lg"
                          onChange={formik.handleChange}
                        />
                        {formik.errors.salary_max && (
                          <div className={classes.pushStarters_ErrorMessage}>
                            {formik.errors.salary_max}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col mt-6 font-poppins font-medium text-sm leading-5">
                    <label htmlFor="Salary">Total Employee</label>
                    <input
                      type="text"
                      id="total_employee"
                      name="total_employee"
                      style={{
                        width: "35.5vw",
                        height: "36px",
                        marginTop: "4px",
                      }}
                      placeholder="ex. 100"
                      value={formik.values.total_employee}
                      className="border border-gray-300 bg-white rounded-lg"
                      onChange={formik.handleChange}
                    />
                    {formik.errors.total_employee && (
                      <div className={classes.pushStarters_ErrorMessage}>
                        {formik.errors.total_employee}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col mt-6 font-poppins font-medium text-sm leading-5">
                    <label htmlFor="Salary">Apply Type</label>
                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        marginTop: "12px",
                      }}
                    >
                      <input
                        type="radio"
                        id="option1"
                        name="apply_type"
                        value="Quick apply"
                        checked={formik.values.apply_type === "Quick apply"}
                        onChange={formik.handleChange}
                      />
                      <label htmlFor="quick apply">Quick Apply</label>

                      <input
                        type="radio"
                        id="option2"
                        name="apply_type"
                        value="External apply"
                        checked={formik.values.apply_type === "External apply"}
                        onChange={formik.handleChange}
                      />
                      <label htmlFor="external apply">External Apply</label>
                    </div>
                  </div>
                  <div className="flex relative justify-end top-24">
                    <input
                      type="submit"
                      value="Save"
                      className="bg-blue-500 shadow-sm rounded-md text-white cursor-pointer"
                      style={{ height: "40px", width: "68px" }}
                    />
                  </div>
                </>
              )}
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobForm;
