import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import api from "../api/axios.js";

const GoalForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    duration: "",
    return_rate: "",
    durationType: "years",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const dataToSend = { ...formData };
      if (formData.durationType === "years") {
        dataToSend.duration = formData.duration * 12;
      }

      const response = await api.post("/goals", dataToSend);
      alert("Goal created successfully!");
      console.log(response.data);

      setFormData({
        name: "",
        amount: "",
        duration: "",
        return_rate: "",
        durationType: "years",
      });
    } catch (err) {
      console.error(err);
      alert("Error creating goal. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Goal Name */}
        <div>
          <label className="block text-sm font-medium">Goal Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Buy a Car"
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        {/* Investment Amount */}
        <div>
          <label className="block text-sm font-medium">
            Investment Amount (₹)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="600000"
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        {/* Duration (Years or Months) */}
        <div>
          <label className="block text-sm font-medium">Duration</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="5"
              className="w-full border rounded-md p-2"
              required
            />
            <select
              name="durationType"
              value={formData.durationType}
              onChange={handleChange}
              className="border rounded-md p-2"
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>

        {/* Return Rate */}
        <div>
          <label className="block text-sm font-medium">
            Expected Return (%)
          </label>
          <input
            type="number"
            name="return_rate"
            value={formData.return_rate}
            onChange={handleChange}
            placeholder="12"
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full rounded-md p-2 font-medium transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isSubmitting ? "Creating Goal..." : "Save Goal"}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default GoalForm;
