import React from "react";
import { Link } from "react-router-dom";
function HomeButton() {
  return (
    <div className="flex justify-center mt-10 mb-20">
        <Link
      to="/manager/dashboard"
      className="bg-green-500 text-white p-4 rounded-lg text-center hover:bg-green-600 "
    >
      Home
    </Link>
    </div>
  );
}

export default HomeButton;
