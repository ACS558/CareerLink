const PlacedStudentGuidance = ({ daysLeft, student }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">🎉</span>
          <div>
            <h2 className="text-2xl font-bold">Congratulations!</h2>
            <p className="text-green-100">You've been placed successfully</p>
          </div>
        </div>

        {student.placedCompany && (
          <div className="mt-4 bg-white/10 rounded-lg p-4">
            <div className="text-sm text-green-100">Placed at</div>
            <div className="text-xl font-bold">{student.placedCompany}</div>
            {student.package && (
              <div className="text-lg">Package: ₹{student.package} LPA</div>
            )}
          </div>
        )}
      </div>

      {/* Expiry Warning */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
        <p className="font-semibold text-orange-800">
          ⏰ Your account expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
        </p>
        <p className="text-sm text-orange-700 mt-1">
          Make sure to download your data before it expires
        </p>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">💡 Tips for Success</h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>
              Be curious and ask questions - don't hesitate to seek help
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Document your learnings and keep notes</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Build relationships with colleagues</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Set clear goals for your first 3 months</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PlacedStudentGuidance;
