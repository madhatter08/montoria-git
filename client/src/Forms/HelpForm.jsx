import React from "react";

const HelpForm = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-5xl border w-100 mx-auto">
      <h2 className="text-l font-bold mb-4 text-center">
        Need Help with Questions? 🛠️
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        To find specific information, please use the following
        examples. Other educational questions will be answered with helpful
        insights.
      </p>

      {/* Information Question Examples */}
      <div className="mb-6">
        <h3 className="text-l font-semibold mb-2 flex items-center">
          <span role="img" aria-label="pin" className="mr-2">
            📌
          </span>
          Information Question Examples
        </h3>
        <ul className="list-disc list-inside text-gray-700">
          <li className="mb-2">
            "What teaching techniques can I use?"
          </li>
          <li className="mb-2">
            "What activity recommendations are there for young learners?"
          </li>
          <li>"What materials can support different teaching ideas?"</li>
        </ul>
      </div>

      {/* Tip */}
      <div className="text-center bg-[#f3f4f6] p-4 rounded-lg">
        <p className="text-gray-600">
          <span role="img" aria-label="lightbulb" className="mr-2">
            💡
          </span>
          <span className="font-semibold">For other educational questions</span>
          , feel free to ask, and you’ll get useful answers based on available
          information.
        </p>
      </div>
    </div>
  );
};

export default HelpForm;
