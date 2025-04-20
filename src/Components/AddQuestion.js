import React from 'react';
import axios from 'axios';

const AddQuestion = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const payload = {
      sub_name: form.subject.value,
      question: form.question.value,
      option_1: form.A.value,
      option_2: form.B.value,
      option_3: form.C.value,
      option_4: form.D.value,
      correct_ans: form.correctAnswer.value,
      difficulty: form.difficulty.value,
      category: form.type.value,
      Branch: form.Branch.value
    };

    try {
      const response = await axios.post("http://localhost:8080/api/insertTechnicalQuestion", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("✅ Question added successfully!");
        form.reset();
      } else {
        alert("❌ Submission failed. Status: " + response.status);
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("⚠️ Something went wrong while submitting the question.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl space-y-4 border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Add New Question</h2>

        <input
          type="text"
          name="subject"
          placeholder="Subject (e.g. Java, DBMS)"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="Branch"
          placeholder="Branch (e.g. CSE, ECE)"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="question"
          placeholder="Enter question"
          required
          className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="A" type="text" placeholder="Option A" required className="p-3 border rounded-lg" />
          <input name="B" type="text" placeholder="Option B" required className="p-3 border rounded-lg" />
          <input name="C" type="text" placeholder="Option C" required className="p-3 border rounded-lg" />
          <input name="D" type="text" placeholder="Option D" required className="p-3 border rounded-lg" />
        </div>

        <input
          type="text"
          name="correctAnswer"
          placeholder="Correct Answer (A/B/C/D)"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="difficulty"
            defaultValue="Medium"
            className="p-3 border border-gray-300 rounded-lg"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            name="type"
            defaultValue="MCQ"
            className="p-3 border border-gray-300 rounded-lg"
          >
            <option value="MCQ">MCQ</option>
            <option value="Coding">Coding</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          Submit Question
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;
