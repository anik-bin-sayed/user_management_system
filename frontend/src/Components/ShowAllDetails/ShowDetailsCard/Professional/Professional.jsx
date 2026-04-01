import React, { memo } from "react";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";

const ProfessionalDetails = memo(({ professional_info, setUpdate }) => {
  const displayValue = (value) => value || "-";

  const formatExperience = (years) => {
    if (years === undefined || years === null) return "-";
    return `${years} ${years === 1 ? "year" : "years"}`;
  };

  const formatDateRange = (start, end) => {
    if (!start && !end) return "";
    const startStr = start || "?";
    const endStr = end || "Present";
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <BriefcaseIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Professional Information
          </h2>
        </div>
        <button
          onClick={() => setUpdate("professional_update")}
          className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium shadow-md"
        >
          <PencilSquareIcon className="w-5 h-5" />
          Edit
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            Professional Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <BriefcaseIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Job Title
                </p>
                <p className="text-base text-gray-800 font-medium truncate">
                  {displayValue(professional_info?.job_title)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <BuildingOfficeIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Company
                </p>
                <p className="text-base text-gray-800 font-medium truncate">
                  {displayValue(professional_info?.company)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <ChartBarIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Industry
                </p>
                <p className="text-base text-gray-800 font-medium truncate">
                  {displayValue(professional_info?.industry)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <ClockIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Experience
                </p>
                <p className="text-base text-gray-800 font-medium truncate">
                  {formatExperience(professional_info?.experience_years) <= 0
                    ? "No Experience"
                    : formatExperience(professional_info?.experience_years)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <UserGroupIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Employment Type
                </p>
                <p className="text-base text-gray-800 font-medium truncate">
                  {displayValue(professional_info?.employment_type)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <CheckCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Available for work
                </p>
                <p className="text-base text-gray-800 font-medium truncate">
                  {professional_info?.available_for_work ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-gray-500">No</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <WrenchScrewdriverIcon className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-800">Skills</h3>
          </div>
          {professional_info?.skills?.length ? (
            <div className="flex flex-wrap gap-2">
              {professional_info.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                >
                  {skill?.name || "Unnamed Skill"}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic bg-gray-50 p-4 rounded-xl border border-gray-100">
              No skills added
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <AcademicCapIcon className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-800">Education</h3>
          </div>
          {professional_info?.educations?.length ? (
            <div className="space-y-3">
              {professional_info.educations.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                >
                  <p className="font-medium text-gray-800">
                    {edu.degree || "Degree not specified"}
                    {edu.field_of_study && ` in ${edu.field_of_study}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {edu.institution || "Institution not specified"}
                  </p>
                  {(edu.start_year || edu.end_year) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {edu.start_year || "?"} - {edu.end_year || "Present"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic bg-gray-50 p-4 rounded-xl border border-gray-100">
              No education added
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <FolderIcon className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-800">Projects</h3>
          </div>
          {professional_info?.projects?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {professional_info.projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                >
                  <p className="font-semibold text-gray-800">
                    {project.name || "Unnamed Project"}
                  </p>
                  {project.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex gap-3 mt-2 text-xs">
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                    {project.live_link && (
                      <a
                        href={project.live_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic bg-gray-50 p-4 rounded-xl border border-gray-100">
              No projects added
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
          <span className="text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </span>
          <span className="text-gray-400">
            {professional_info?.skills?.length || 0} skills,{" "}
            {professional_info?.educations?.length || 0} educations,{" "}
            {professional_info?.projects?.length || 0} projects
          </span>
        </div>
      </div>
    </div>
  );
});

ProfessionalDetails.displayName = "ProfessionalDetails";

export default ProfessionalDetails;
