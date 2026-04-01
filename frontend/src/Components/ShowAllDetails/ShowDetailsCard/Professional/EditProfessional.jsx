import React, { useState, useEffect } from "react";
// adjust import
import {
  BriefcaseIcon,
  AcademicCapIcon,
  FolderIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  useUpdateUserProfileMutation,
  useUserProfileQuery,
} from "../../../../Features/user/userProfileApi";
import { showErrorToast } from "../../../../utils/showErrorToast";
import { showSuccessToast } from "../../../../utils/showSuccessToast";

const initialState = {
  job_title: "",
  company: "",
  industry: "",
  experience_years: "",
  employment_type: "",
  available_for_work: false,
  skills: "",
  educations: [],
  projects: [],
};

const EditProfessional = ({ professional_info, setUpdate }) => {
  const [professionalInfo, setProfessionalInfo] = useState(initialState);

  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { refetch } = useUserProfileQuery();

  useEffect(() => {
    if (professional_info) {
      const skillsString =
        professional_info?.skills?.map((s) => s.name).join(", ") || "";

      setProfessionalInfo({
        job_title: professional_info.job_title || "",
        company: professional_info.company || "",
        industry: professional_info.industry || "",
        experience_years: professional_info.experience_years || "",
        employment_type: professional_info.employment_type || "",
        available_for_work: professional_info.available_for_work || false,
        skills: skillsString,
        educations: professional_info.educations || [],
        projects: professional_info.projects || [],
      });
    }
  }, [professional_info]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfessionalInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducations = [...professionalInfo.educations];

    updatedEducations[index] = {
      ...updatedEducations[index],
      [field]: value,
    };

    setProfessionalInfo((prev) => ({
      ...prev,
      educations: updatedEducations,
    }));
  };

  const addEducation = () => {
    setProfessionalInfo((prev) => ({
      ...prev,
      educations: [
        ...prev.educations,
        {
          id: Date.now(),
          degree: "",
          field_of_study: "",
          institution: "",
          start_year: "",
          end_year: "",
        },
      ],
    }));
  };

  const removeEducation = (index) => {
    const updatedEducations = professionalInfo.educations.filter(
      (_, i) => i !== index,
    );
    setProfessionalInfo((prev) => ({ ...prev, educations: updatedEducations }));
  };

  // Project handlers
  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...professionalInfo.projects];

    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    };

    setProfessionalInfo((prev) => ({
      ...prev,
      projects: updatedProjects,
    }));
  };

  const addProject = () => {
    setProfessionalInfo((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Date.now(),
          name: "",
          description: "",
          github_link: "",
          live_link: "",
        },
      ],
    }));
  };

  const removeProject = (index) => {
    const updatedProjects = professionalInfo.projects.filter(
      (_, i) => i !== index,
    );
    setProfessionalInfo((prev) => ({ ...prev, projects: updatedProjects }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const skillsArray = professionalInfo.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map((name) => ({ name })); // or just `name` if backend wants strings

    const educations = professionalInfo.educations.map(
      ({ id, ...rest }) => rest,
    );
    const projects = professionalInfo.projects.map(({ id, ...rest }) => rest);

    // Construct payload – adjust key to match your API
    const payload = {
      professional_info: {
        job_title: professionalInfo.job_title,
        company: professionalInfo.company,
        industry: professionalInfo.industry,
        experience_years: professionalInfo.experience_years
          ? parseInt(professionalInfo.experience_years)
          : undefined,
        employment_type: professionalInfo.employment_type,
        available_for_work: professionalInfo.available_for_work,
        skills: skillsArray,
        educations,
        projects,
      },
    };

    try {
      await updateUserProfile(payload).unwrap();
      showSuccessToast("Professional information updated successfully!");
      setUpdate("");
      refetch();
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <BriefcaseIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Edit Professional Information
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setUpdate("")}
          className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Professional Overview Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Title */}
          <div>
            <label
              htmlFor="job_title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Title
            </label>
            <input
              type="text"
              id="job_title"
              name="job_title"
              value={professionalInfo.job_title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="e.g. Software Engineer"
            />
          </div>

          {/* Company */}
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={professionalInfo.company}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Company name"
            />
          </div>

          {/* Industry */}
          <div>
            <label
              htmlFor="industry"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Industry
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={professionalInfo.industry}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="e.g. Technology"
            />
          </div>

          {/* Experience Years */}
          <div>
            <label
              htmlFor="experience_years"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Experience (years)
            </label>
            <input
              type="number"
              id="experience_years"
              name="experience_years"
              value={professionalInfo.experience_years}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="5"
            />
          </div>

          {/* Employment Type */}
          <div>
            <label
              htmlFor="employment_type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Employment Type
            </label>
            <select
              id="employment_type"
              name="employment_type"
              value={professionalInfo.employment_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
            >
              <option value="">Select</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Available for Work */}
          <div className="flex items-center h-full pt-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="available_for_work"
                checked={professionalInfo.available_for_work}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <CheckCircleIcon className="w-5 h-5 text-gray-500" />
              <span>Available for work</span>
            </label>
          </div>
        </div>

        {/* Skills */}
        <div className="md:col-span-2">
          <label
            htmlFor="skills"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Skills (comma separated)
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={professionalInfo.skills}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="React, Node.js, Python, ..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate skills with commas
          </p>
        </div>

        {/* Education Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">Education</h3>
            </div>
            <button
              type="button"
              onClick={addEducation}
              className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              <PlusIcon className="w-4 h-4" />
              Add Education
            </button>
          </div>
          {professionalInfo.educations.map((edu, index) => (
            <div
              key={edu.id || index}
              className="relative p-4 mb-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={edu.degree || ""}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={edu.field_of_study || ""}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "field_of_study",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={edu.institution || ""}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "institution",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="University name"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 font-medium mb-1">
                      Start Year
                    </label>
                    <input
                      type="text"
                      value={edu.start_year || ""}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          "start_year",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="2020"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 font-medium mb-1">
                      End Year
                    </label>
                    <input
                      type="text"
                      value={edu.end_year || ""}
                      onChange={(e) =>
                        handleEducationChange(index, "end_year", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="2024"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FolderIcon className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
            </div>
            <button
              type="button"
              onClick={addProject}
              className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              <PlusIcon className="w-4 h-4" />
              Add Project
            </button>
          </div>
          {professionalInfo.projects.map((proj, index) => (
            <div
              key={proj.id || index}
              className="relative p-4 mb-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={proj.name || ""}
                    onChange={(e) =>
                      handleProjectChange(index, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Project name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={proj.description || ""}
                    onChange={(e) =>
                      handleProjectChange(index, "description", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Brief description"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1">
                    GitHub Link
                  </label>
                  <input
                    type="url"
                    value={proj.github_link || ""}
                    onChange={(e) =>
                      handleProjectChange(index, "github_link", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1">
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    value={proj.live_link || ""}
                    onChange={(e) =>
                      handleProjectChange(index, "live_link", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setUpdate("")}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfessional;
