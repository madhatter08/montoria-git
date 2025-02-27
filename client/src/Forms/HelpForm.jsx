import React from 'react';

const HelpForm = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-5xl border w-100 mx-auto">
      <h2 className="text-l font-bold mb-4 text-center">Need Help? Try These Prompts!</h2>
      <p className="text-gray-600 mb-6 text-center">
        Use the prompts below to ask the chatbot for educational recommendations.
      </p>

      {/* Activity Suggestions */}
      <div className="mb-6">
        <h3 className="text-l font-semibold mb-2 flex items-center">
          <span role="img" aria-label="lightbulb" className="mr-2">
            📌
          </span>
          Activity Suggestions
        </h3>
        <ul className="list-disc list-inside text-gray-700">
          <li className="mb-2">
            "Recommend activities for <span className="font-semibold">[Level]</span> focused on{' '}
            <span className="font-semibold">[Lesson]</span>."
          </li>
          <li className="mb-2">
            "Suggest an activity for <span className="font-semibold">[Learning Area]</span> to enhance
            students' <span className="font-semibold">[Skill]</span> for{' '}
            <span className="font-semibold">[Level]</span>."
          </li>
          <li>
            "What group task can I assign to the <span className="font-semibold">[Level]</span> in{' '}
            <span className="font-semibold">[Learning Area]</span> for{' '}
            <span className="font-semibold">[Lesson]</span>?"
          </li>
        </ul>
      </div>

      {/* Materials & Resources */}
      <div className="mb-6">
        <h3 className="text-l font-semibold mb-2 flex items-center">
          <span role="img" aria-label="books" className="mr-2">
            📚
          </span>
          Materials & Resources
        </h3>
        <ul className="list-disc list-inside text-gray-700">
          <li className="mb-2">
            "Can you list the materials needed for{' '}
            <span className="font-semibold">[Activity]</span>?"
          </li>
          <li className="mb-2">
            "What available materials for <span className="font-semibold">[Lesson]</span> on{' '}
            <span className="font-semibold">[Level]</span>?"
          </li>
          <li>
            "What works can I do with <span className="font-semibold">[Material]</span> for{' '}
            <span className="font-semibold">[Level]</span>?"
          </li>
        </ul>
      </div>

      {/* Tip */}
      <div className="text-center bg-[#f3f4f6] p-4 rounded-lg">
        <p className="text-gray-600">
          <span role="img" aria-label="lightbulb" className="mr-2">
            💡
          </span>
          <span className="font-semibold">Tip:</span> Be specific with your query for the best
          results!
        </p>
      </div>
    </div>
  );
};

export default HelpForm;