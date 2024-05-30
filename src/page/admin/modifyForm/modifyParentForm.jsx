import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  doGetParentData,
  doUpdateParentData,
} from "../../../controller/firestoreController";

ModifyParentForm.propTypes = {
  parentId: PropTypes.string.isRequired,
  closeForm: PropTypes.func.isRequired,
};

function ModifyParentForm({ parentId, closeForm }) {
  const [parentData, setParentData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });

  // Fetch the current data of the parent when the component mounts
  useEffect(() => {
    // Replace this with your actual data fetching logic
    doGetParentData(parentId).then((data) => {
      setParentData(data);
    });
  }, [parentId]);

  const handleInputChange = (event) => {
    setParentData({
      ...parentData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!parentData.name || !parentData.address || !parentData.phoneNumber) {
      alert("Please fill in all fields");
      setParentData({ name: "", address: "", phoneNumber: "" });
      return;
    }
    if (parentData.phoneNumber.length < 10) {
      alert("Phone number must be at least 10 characters");
      setParentData({ ...parentData, phoneNumber: "" });
      return;
    }
    const isPhoneNumberValid = /^\d+$/.test(parentData.phoneNumber);
    if (!isPhoneNumberValid) {
      alert("Phone number must be numeric");
      setParentData({ ...parentData, phoneNumber: "" });
      return;
    }
    if (parentData.name.length < 3) {
      alert("Name must be at least 3 characters");
      setParentData({ ...parentData, name: "" });
      return;
    }
    if (parentData.phoneNumber.length > 15) {
      alert("Phone number must be at most 15 characters");
      setParentData({ ...parentData, phoneNumber: "" });
      return;
    }
    if (parentData.name.length > 50) {
      alert("Name must be at most 50 characters");
      setParentData({ ...parentData, name: "" });
      return;
    }
    // Replace this with your actual update logic
    doUpdateParentData(parentId, parentData).then(() => {
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
          value={parentData.name}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Address:
        <input
          type="text"
          name="address"
          value={parentData.address}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Phone Number:
        <input
          type="text"
          name="phoneNumber"
          value={parentData.phoneNumber}
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

export default ModifyParentForm;
