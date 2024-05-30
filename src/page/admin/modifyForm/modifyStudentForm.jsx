import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  doGetStudentData,
  doUpdateStudentData,
} from "../../../controller/firestoreController";

ModifyStudentForm.propTypes = {
  studentId: PropTypes.string.isRequired,
  parents: PropTypes.array.isRequired,
  closeForm: PropTypes.func.isRequired,
};

function ModifyStudentForm({ studentId, parents, closeForm }) {
  const [studentData, setStudentData] = useState({
    name: "",
    parentID: "",
    address: "",
    phoneNumber: "",
  });

  const [parentID, setParentID] = useState("");

  // Fetch the current data of the parent when the component mounts
  useEffect(() => {
    // Replace this with your actual data fetching logic
    doGetStudentData(studentId).then((data) => {
      setStudentData(data);
      setParentID(data.parentID);
    });
  }, [studentId]);

  const handleInputChange = (event) => {
    setStudentData({
      ...studentData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !studentData.name ||
      !studentData.address ||
      !studentData.phoneNumber ||
      !studentData.parentID
    ) {
      alert("Please fill in all fields");
      setStudentData({ name: "", address: "", phoneNumber: "" });
      return;
    }
    if (studentData.phoneNumber.length < 10) {
      alert("Phone number must be at least 10 characters");
      setStudentData({ ...studentData, phoneNumber: "" });
      return;
    }
    const isPhoneNumberValid = /^\d+$/.test(studentData.phoneNumber);
    if (!isPhoneNumberValid) {
      alert("Phone number must be numeric");
      setStudentData({ ...studentData, phoneNumber: "" });
      return;
    }
    if (studentData.name.length < 3) {
      alert("Name must be at least 3 characters");
      setStudentData({ ...studentData, name: "" });
      return;
    }
    if (studentData.phoneNumber.length > 15) {
      alert("Phone number must be at most 15 characters");
      setStudentData({ ...studentData, phoneNumber: "" });
      return;
    }
    if (studentData.name.length > 50) {
      alert("Name must be at most 50 characters");
      setStudentData({ ...studentData, name: "" });
      return;
    }
    // Replace this with your actual update logic
    doUpdateStudentData(studentId, studentData, parentID).then(() => {
      closeForm();
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={studentData.name}
          onChange={handleInputChange}
        />
      </label>
      <label>Parent</label>
      <select
        value={studentData.parentID}
        onChange={(e) =>
          setStudentData({ ...studentData, parentID: e.target.value })
        }
      >
        <option value="">Select Parent</option>
        <option value={parentID}>
          {parents.find((parent) => parent.id === parentID)?.name}
        </option>
        {parents
          .filter((parent) => parent.hasChild === false)
          .map((parent) => (
            <option key={parent.id} value={parent.id}>
              {parent.name}
            </option>
          ))}
      </select>
      <label>
        Address:
        <input
          type="text"
          name="address"
          value={studentData.address}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Phone Number:
        <input
          type="text"
          name="phoneNumber"
          value={studentData.phoneNumber}
          onChange={handleInputChange}
        />
      </label>
      <button type="submit">Submit</button>
      <button type="button" onClick={closeForm}>
        Cancel
      </button>
    </form>
  );
}

export default ModifyStudentForm;
