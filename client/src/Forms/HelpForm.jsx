import React from 'react'; 

const HelpForm = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-5xl border w-100 mx-auto">
      <h2 className="text-l font-bold mb-4 text-center">Need Help with Queries? 🛠️</h2>
      <p className="text-gray-600 mb-6 text-center">
        To retrieve structured data from the database, please use the following prompt formats. Other educational queries will be answered using AI knowledge.
      </p>

      {/* Database Query Prompts */}
      <div className="mb-6">
        <h3 className="text-l font-semibold mb-2 flex items-center">
          <span role="img" aria-label="database" className="mr-2">
            📌
          </span>
          Database Query Prompts
        </h3>
        <ul className="list-disc list-inside text-gray-700">
          <li className="mb-2">
            "What are the lessons in <span className='font-semibold'>[Areas]</span> for <span className='font-semibold'>[Level]</span>?"
          </li>
          <li className="mb-2">
            "What <span className='font-semibold'>[Areas]</span> materials are available for <span className='font-semibold'>[Level]</span>?"
          </li>
          <li className="mb-2">
            "What are the works for <span className='font-semibold'>[Level]</span> in the <span className='font-semibold'>[Areas]</span> area?"
          </li>
          <li>
            "What materials are needed for the <span className='font-semibold'>[Lesson]</span> lesson?"
          </li>
        </ul>
      </div>

      {/* Tip */}
      <div className="text-center bg-[#f3f4f6] p-4 rounded-lg">
        <p className="text-gray-600">
          <span role="img" aria-label="lightbulb" className="mr-2">
            💡
          </span>
          <span className="font-semibold">For other educational queries</span>, feel free to ask, and the AI will provide relevant information from its knowledge base.
        </p>
      </div>
    </div>
  );
};

export default HelpForm;
