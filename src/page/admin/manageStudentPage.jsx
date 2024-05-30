import { useEffect, useState } from "react";
import axiosInstance from "../../controller/axiosInstance";
import { db } from "../../config/firebaseConfig";
import { onSnapshot, collection, query } from "firebase/firestore";
import StudentListComponent from "./studentListComponent";

export default function ManageStudentPage() {
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);

  const [authStu, setAuthStu] = useState({
    email: "",
    password: "",
    role: "student",
  });
  const [stuInfo, setStuInfo] = useState({
    name: "",
    parentID: "",
    address: "",
    phoneNumber: "",
  });

  const addStudent = async (data) => {
    const response = await axiosInstance.post("/addStudent", data);
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        authStu.email === "" ||
        authStu.password === "" ||
        stuInfo.name === "" ||
        stuInfo.parentID === "" ||
        stuInfo.address === "" ||
        stuInfo.phoneNumber === ""
      ) {
        alert("Please fill in all fields");
        return;
      }
      if (students.find((student) => student.email === authStu.email)) {
        alert("Student already exists");
        return;
      }
      if (stuInfo.phoneNumber.length !== 10) {
        alert("Phone number must be 10 digits");
        return;
      }
      if (isNaN(stuInfo.phoneNumber)) {
        alert("Phone number must be a number");
        return;
      }
      const result = await addStudent({
        email: authStu.email,
        password: authStu.password,
        role: authStu.role,
        name: stuInfo.name,
        parentID: stuInfo.parentID,
        address: stuInfo.address,
        phoneNumber: stuInfo.phoneNumber,
      });
      console.log(result);
      alert("Student added successfully");
      setAuthStu({ email: "", password: "", role: "student" });
      setStuInfo({
        name: "",
        parentID: "",
        address: "",
        phoneNumber: "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed to add student");
    }
  };

  useEffect(() => {
    const queryStudent = query(collection(db, "student"));
    const unsubscribeStudent = onSnapshot(
      queryStudent,
      (snapShot) => {
        let studentList = [];
        snapShot.docs.forEach((doc) => {
          studentList.push({ id: doc.id, ...doc.data() });
        });
        setStudents(studentList);
      },
      (error) => {
        console.log(error);
      }
    );

    const queryParent = query(collection(db, "parent"));

    const unsubscribeParent = onSnapshot(
      queryParent,
      (snapShot) => {
        let parentList = [];
        snapShot.docs.forEach((doc) => {
          parentList.push({ id: doc.id, ...doc.data() });
        });
        setParents(parentList);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubscribeStudent();
      unsubscribeParent();
    };
  }, []);

  return (
    <div>
      <h1>Student&apos;s List</h1>
      <StudentListComponent students={students} parents={parents} />
      <h1>Add Student</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Email</label>
        <input
          type="text"
          value={authStu.email}
          onChange={(e) => setAuthStu({ ...authStu, email: e.target.value })}
        />
        <label>Password</label>
        <input
          type="password"
          value={authStu.password}
          onChange={(e) => setAuthStu({ ...authStu, password: e.target.value })}
        />
        <label>Name</label>
        <input
          type="text"
          value={stuInfo.name}
          onChange={(e) => setStuInfo({ ...stuInfo, name: e.target.value })}
        />
        <label>Parent</label>
        <select
          value={stuInfo.parentID}
          onChange={(e) => setStuInfo({ ...stuInfo, parentID: e.target.value })}
        >
          <option value="">Select Parent</option>
          {parents
            .filter((parent) => parent.hasChild === false)
            .map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.name}
              </option>
            ))}
        </select>
        <label>Address</label>
        <input
          type="text"
          value={stuInfo.address}
          onChange={(e) => setStuInfo({ ...stuInfo, address: e.target.value })}
        />
        <label>Phone Number</label>
        <input
          type="text"
          value={stuInfo.phoneNumber}
          onChange={(e) =>
            setStuInfo({ ...stuInfo, phoneNumber: e.target.value })
          }
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Student Adding info</h3>
      <p>Email: {authStu.email}</p>
      <p>Password: {authStu.password}</p>
      <p>Name: {stuInfo.name}</p>
      <p>Parent: {stuInfo.parentID}</p>
      <p>Address: {stuInfo.address}</p>
      <p>Phone Number: {stuInfo.phoneNumber}</p>
    </div>
  );
}
