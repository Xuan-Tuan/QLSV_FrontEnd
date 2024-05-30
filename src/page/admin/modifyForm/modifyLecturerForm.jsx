import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  doGetLecturerData,
  doUpdateLecturerData,
} from "../../../controller/firestoreController";

ModifyLecturerForm.propTypes = {
  lecturerId: PropTypes.string.isRequired,
  closeForm: PropTypes.func.isRequired,
};

function ModifyLecturerForm({ lecturerId, closeForm }) {
  const [lecturerData, setLecturerData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });

  // Fetch the current data of the lecturer when the component mounts
  useEffect(() => {
    // Replace this with your actual data fetching logic
    doGetLecturerData(lecturerId).then((data) => {
      setLecturerData(data);
    });
  }, [lecturerId]);

  const handleInputChange = (event) => {
    setLecturerData({
      ...lecturerData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !lecturerData.name ||
      !lecturerData.address ||
      !lecturerData.phoneNumber
    ) {
      alert("Please fill in all fields");
      setLecturerData({ name: "", address: "", phoneNumber: "" });
      return;
    }
    const isPhoneNumberValid = /^\d+$/.test(lecturerData.phoneNumber);
    if (!isPhoneNumberValid) {
      alert("Phone number must contain only numbers");
      setLecturerData({ ...lecturerData, phoneNumber: "" });
      return;
    }
    if (lecturerData.phoneNumber.length < 10) {
      alert("Phone number must be at least 10 characters");
      setLecturerData({ ...lecturerData, phoneNumber: "" });
      return;
    }
    if (lecturerData.phoneNumber.length > 15) {
      alert("Phone number must be at most 15 characters");
      setLecturerData({ ...lecturerData, phoneNumber: "" });
      return;
    }
    if (lecturerData.name.length < 3) {
      alert("Name must be at least 3 characters");
      setLecturerData({ ...lecturerData, name: "" });
      return;
    }
    // Replace this with your actual update logic
    doUpdateLecturerData(lecturerId, lecturerData).then(() => {
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
          value={lecturerData.name}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Address:
        <input
          type="text"
          name="address"
          value={lecturerData.address}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Phone Number:
        <input
          type="text"
          name="phoneNumber"
          value={lecturerData.phoneNumber}
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

export default ModifyLecturerForm;
