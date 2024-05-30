import { useEffect, useState } from "react";
import { db } from "../../config/firebaseConfig";
import { onSnapshot, collection, query } from "firebase/firestore";
import { doDeleteLecturer } from "../../controller/firestoreController";
import axiosInstance from "../../controller/axiosInstance";
import ModifyLecturerForm from "./modifyForm/modifyLecturerForm";

export default function ManageLecturerPage() {
  const [lecturers, setLecturers] = useState([]);
  const [authLec, setAuthLec] = useState({
    email: "",
    password: "",
    role: "lecturer",
  });
  const [lecInfo, setLecInfo] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });
  const [currentLecturerId, setCurrentLecturerId] = useState("");
  const [isModifyFormOpen, setIsModifyFormOpen] = useState(false);

  const addLecturer = async (data) => {
    const response = await axiosInstance.post("/addLecturer", data);
    return response;
  };

  const deleteLecturer = async (id) => {
    const response = await axiosInstance.post("/deleteLecturer", { id });
    return response;
  };

  const handleModifyLecturer = (e, lecturerId) => {
    e.preventDefault();
    setIsModifyFormOpen(true);
    setCurrentLecturerId(lecturerId);
  };

  const handleDeleteLecturer = async (e, id) => {
    e.preventDefault();
    try {
      await doDeleteLecturer(id);
      const result = await deleteLecturer(id);
      console.log(result);
      alert("Lecturer deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete lecturer");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !authLec.email ||
        !authLec.password ||
        !lecInfo.name ||
        !lecInfo.address ||
        !lecInfo.phoneNumber
      ) {
        alert("Please fill in all fields");
        setAuthLec({ email: "", password: "", role: "lecturer" });
        setLecInfo({ name: "", address: "", phoneNumber: "" });
        return;
      }
      if (authLec.password.length < 6) {
        alert("Password must be at least 6 characters");
        setAuthLec({ ...authLec, password: "" });
        return;
      }
      if (lecInfo.phoneNumber.length < 10) {
        alert("Phone number must be at least 10 characters");
        setLecInfo({ ...lecInfo, phoneNumber: "" });
        return;
      }
      if (lecInfo.phoneNumber.length > 15) {
        alert("Phone number must be at most 15 characters");
        setLecInfo({ ...lecInfo, phoneNumber: "" });
        return;
      }
      if (authLec.email.length < 6) {
        alert("Email must be at least 6 characters");
        setAuthLec({ ...authLec, email: "" });
        return;
      }
      if (authLec.email.length > 50) {
        alert("Email must be at most 50 characters");
        setAuthLec({ ...authLec, email: "" });
        return;
      }
      if (lecInfo.name.length < 3) {
        alert("Name must be at least 3 characters");
        setLecInfo({ ...lecInfo, name: "" });
        return;
      }
      const result = await addLecturer({
        email: authLec.email,
        password: authLec.password,
        role: authLec.role,
        name: lecInfo.name,
        address: lecInfo.address,
        phoneNumber: lecInfo.phoneNumber,
      });
      console.log(result);
      alert("Lecturer added successfully");
      setAuthLec({ email: "", password: "", role: "lecturer" });
      setLecInfo({ name: "", address: "", phoneNumber: "" });
    } catch (error) {
      console.log(error);
      alert("Failed to add lecturer");
    }
  };

  useEffect(() => {
    const queryLecturer = query(collection(db, "lecturer"));
    const unsubscribe = onSnapshot(
      queryLecturer,
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setLecturers(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h1>Lecturer&apos;s List</h1>
      <ul>
        {lecturers.map((lecturer) => (
          <li key={lecturer.id}>
            {lecturer.name} - {lecturer.email} - {lecturer.address} -{" "}
            {lecturer.phoneNumber}
            <button onClick={(e) => handleModifyLecturer(e, lecturer.id)}>
              Modify
            </button>
            <button onClick={(e) => handleDeleteLecturer(e, lecturer.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <br />
      {isModifyFormOpen && (
        <ModifyLecturerForm
          lecturerId={currentLecturerId}
          closeForm={() => setIsModifyFormOpen(false)}
        />
      )}
      <br />
      <h1>Add Lecturer</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Email</label>
        <input
          type="text"
          value={authLec.email}
          onChange={(e) => setAuthLec({ ...authLec, email: e.target.value })}
        />
        <label>Password</label>
        <input
          type="password"
          value={authLec.password}
          onChange={(e) => setAuthLec({ ...authLec, password: e.target.value })}
        />
        <label>Name</label>
        <input
          type="text"
          value={lecInfo.name}
          onChange={(e) => setLecInfo({ ...lecInfo, name: e.target.value })}
        />
        <label>Address</label>
        <input
          type="text"
          value={lecInfo.address}
          onChange={(e) => setLecInfo({ ...lecInfo, address: e.target.value })}
        />
        <label>Phone Number</label>
        <input
          type="text"
          value={lecInfo.phone}
          onChange={(e) =>
            setLecInfo({ ...lecInfo, phoneNumber: e.target.value })
          }
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
