import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <span className="text-8xl">🚫</span>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Unauthorized</h1>
        <p className="text-gray-500 mt-2">
          You don't have permission to access this page.
        </p>
        <Link to="/" className="mt-6 inline-block btn-primary px-6 py-3">
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
