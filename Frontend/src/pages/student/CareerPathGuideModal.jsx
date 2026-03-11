import { useState } from "react";
import { careerPathGuides } from "../../data/careerPathGuides";

const CareerPathGuideModal = ({ pathType, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const guide = careerPathGuides[pathType];

  if (!guide) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8 transform animate-slideUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <span className="text-5xl">{guide.icon}</span>
            <div>
              <h2 className="text-3xl font-bold">{guide.title}</h2>
              <p className="text-blue-100 mt-1">{guide.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Higher Education & Skill Development */}
          {(pathType === "higher_education" ||
            pathType === "skill_development") && (
            <>
              {/* Tabs */}
              <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                {guide.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${
                      activeTab === idx
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {guide.options.map(
                (option, idx) =>
                  activeTab === idx && (
                    <div key={idx} className="space-y-6">
                      {/* Quick Stats */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                          <div className="text-sm text-blue-600 font-semibold mb-1">
                            Duration
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {option.duration}
                          </div>
                        </div>
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                          <div className="text-sm text-green-600 font-semibold mb-1">
                            Avg Cost
                          </div>
                          <div className="text-xl font-bold text-gray-900">
                            {option.avgCost}
                          </div>
                        </div>
                        {option.exams && (
                          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                            <div className="text-sm text-purple-600 font-semibold mb-1">
                              Required Exams
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {option.exams.join(", ")}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Top Colleges/Universities */}
                      {(option.topColleges ||
                        option.topUniversities ||
                        option.topInstitutes) && (
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="font-bold text-xl mb-4 flex items-center">
                            <span className="text-2xl mr-2">🏛️</span>
                            Top Institutions
                          </h3>
                          <div className="grid md:grid-cols-2 gap-3">
                            {(
                              option.topColleges ||
                              option.topUniversities ||
                              option.topInstitutes
                            ).map((college, i) => (
                              <div
                                key={i}
                                className="flex items-center space-x-2"
                              >
                                <svg
                                  className="w-5 h-5 text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span className="text-gray-700">{college}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Benefits */}
                      {option.benefits && (
                        <div className="bg-green-50 rounded-xl p-6">
                          <h3 className="font-bold text-xl mb-4 flex items-center">
                            <span className="text-2xl mr-2">✨</span>
                            Key Benefits
                          </h3>
                          <ul className="space-y-2">
                            {option.benefits.map((benefit, i) => (
                              <li
                                key={i}
                                className="flex items-start space-x-2"
                              >
                                <svg
                                  className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="text-gray-700">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Timeline */}
                      {option.timeline && (
                        <div className="bg-purple-50 rounded-xl p-6">
                          <h3 className="font-bold text-xl mb-4 flex items-center">
                            <span className="text-2xl mr-2">📅</span>
                            Timeline
                          </h3>
                          <div className="space-y-3">
                            {Object.entries(option.timeline).map(
                              ([period, task], i) => (
                                <div
                                  key={i}
                                  className="flex items-start space-x-4"
                                >
                                  <div className="bg-purple-200 text-purple-700 px-3 py-1 rounded-lg font-semibold text-sm whitespace-nowrap">
                                    {period}
                                  </div>
                                  <div className="text-gray-700">{task}</div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* Top Courses */}
                      {option.topCourses && (
                        <div className="bg-orange-50 rounded-xl p-6">
                          <h3 className="font-bold text-xl mb-4 flex items-center">
                            <span className="text-2xl mr-2">📚</span>
                            Recommended Courses
                          </h3>
                          <ul className="space-y-2">
                            {option.topCourses.map((course, i) => (
                              <li
                                key={i}
                                className="flex items-start space-x-2"
                              >
                                <svg
                                  className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                  />
                                </svg>
                                <span className="text-gray-700">{course}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Career Opportunities */}
                      {option.careerOpportunities && (
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                          <div className="flex items-center space-x-2 text-blue-900 font-semibold">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span>
                              Career Opportunities: {option.careerOpportunities}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ),
              )}
            </>
          )}

          {/* Off-Campus Jobs */}
          {pathType === "off_campus" && (
            <div className="space-y-6">
              {/* Strategies */}
              {guide.strategies && (
                <>
                  <h3 className="text-2xl font-bold mb-4">
                    Job Search Strategies
                  </h3>
                  {guide.strategies.map((strategy, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-xl mb-4 text-blue-600">
                        {strategy.name}
                      </h4>

                      {strategy.platforms && (
                        <div className="mb-4">
                          <div className="font-semibold text-gray-700 mb-2">
                            Platforms:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {strategy.platforms.map((platform, i) => (
                              <span
                                key={i}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                              >
                                {platform}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {strategy.tips && (
                        <div>
                          <div className="font-semibold text-gray-700 mb-2">
                            Tips:
                          </div>
                          <ul className="space-y-2">
                            {strategy.tips.map((tip, i) => (
                              <li
                                key={i}
                                className="flex items-start space-x-2"
                              >
                                <svg
                                  className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span className="text-gray-700">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {strategy.timeCommitment && (
                        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-3">
                          <span className="font-semibold text-yellow-800">
                            Time Commitment: {strategy.timeCommitment}
                          </span>
                        </div>
                      )}

                      {strategy.successRate && (
                        <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-3">
                          <span className="font-semibold text-green-800">
                            Success Rate: {strategy.successRate}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Preparation */}
              {guide.preparation && (
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-2xl font-bold mb-4">
                    Preparation Checklist
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(guide.preparation).map(
                      ([key, items], idx) => (
                        <div key={idx}>
                          <h4 className="font-bold text-lg mb-3 capitalize text-purple-700">
                            {key}
                          </h4>
                          <ul className="space-y-2">
                            {items.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start space-x-2"
                              >
                                <svg
                                  className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Freelancing */}
          {pathType === "freelancing" && (
            <div className="space-y-6">
              {/* Platforms */}
              {guide.platforms && (
                <>
                  <h3 className="text-2xl font-bold mb-4">
                    Top Freelancing Platforms
                  </h3>
                  {guide.platforms.map((platform, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-2xl text-blue-600">
                          {platform.name}
                        </h4>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {platform.type}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-3">
                          <div className="text-sm text-gray-600">Best For</div>
                          <div className="font-semibold text-gray-900">
                            {platform.bestFor}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <div className="text-sm text-gray-600">
                            Avg Earnings
                          </div>
                          <div className="font-semibold text-green-600 text-lg">
                            {platform.avgEarnings}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="font-semibold text-gray-700 mb-2">
                          Requirements:
                        </div>
                        <div className="text-gray-600">
                          {platform.requirements}
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold text-gray-700 mb-2">
                          Success Tips:
                        </div>
                        <ul className="space-y-2">
                          {platform.tips.map((tip, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <svg
                                className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="text-gray-700">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Skills in Demand */}
              {guide.skillsInDemand && (
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="text-3xl mr-2">🔥</span>
                    Skills in High Demand
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {guide.skillsInDemand.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-green-200 text-green-800 px-4 py-2 rounded-lg font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Building Portfolio */}
              {guide.buildingPortfolio && (
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="text-3xl mr-2">💼</span>
                    Building Your Portfolio
                  </h3>
                  <ul className="space-y-3">
                    {guide.buildingPortfolio.map((item, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <div className="bg-purple-200 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-gray-700 pt-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Resources (Common for all) */}
          {guide.resources && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mt-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <span className="text-3xl mr-2">🔗</span>
                Helpful Resources
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {guide.resources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-white hover:bg-indigo-50 p-4 rounded-lg border-2 border-transparent hover:border-indigo-300 transition group"
                  >
                    <span className="font-semibold text-gray-700 group-hover:text-indigo-600">
                      {resource.name}
                    </span>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl flex justify-end border-t">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg"
          >
            Close Guide
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CareerPathGuideModal;
