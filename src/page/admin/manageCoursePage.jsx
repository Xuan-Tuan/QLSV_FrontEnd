import { useState, useEffect } from "react";
import { onSnapshot, collection, query } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import {
  doAddCourse,
  doAddCourseStudent,
  doAddScheduleCourse,
  doDeleteCourse,
  doGetLecturerName,
} from "../../controller/firestoreController";
import { Link } from "react-router-dom";
import ModifyCourseForm from "./modifyForm/modifyCourseForm";

export default function ManageCoursePage() {
  const [roomList, setRoomList] = useState([]);
  const [lecturerList, setLecturerList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [courseStudentList, setCourseStudentList] = useState([]);

  const [courseList, setCourseList] = useState([]);

  const [currentCourseID, setCurrentCourseID] = useState("");
  const [isModifyFormOpen, setIsModifyFormOpen] = useState(false);

  const [course, setCourse] = useState({
    roomID: "",
    lecturerID: "",
    code: "",
    name: "",
    onlineURL: "",
    startDay: new Date(),
    week: 0,
    startTime: "",
    endTime: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        course.roomID === "" ||
        course.lecturerID === "" ||
        course.code === "" ||
        course.name === "" ||
        course.startDay === "" ||
        course.week === 0 ||
        course.startTime === "" ||
        course.endTime === ""
      ) {
        alert("Please fill all the fields");
        return;
      }
      if (courseStudentList.length === 0) {
        alert("Please select at least one student");
        return;
      }
      if (course.startDay.getDay() !== 1) {
        alert("Start day must be Monday");
        return;
      }
      if (course.week < 1 || course.week > 16) {
        alert("Week must be between 1 and 16");
        return;
      }
      if (course.startTime >= course.endTime) {
        alert("End time must be after start time");
        return;
      }
      if (course.onlineURL === "") {
        course.onlineURL = null;
      }
      if (course.startDay < new Date()) {
        alert("Start day must be in the future");
        return;
      }
      const isValidCourseID = courseList.every(
        (course) => course.code !== course.code
      );
      if (!isValidCourseID) {
        alert("Course ID already exists");
        return;
      }
      await doAddCourse(course);
      await doAddCourseStudent(course.code, courseStudentList);
      await doAddScheduleCourse(
        course.code,
        course.startDay,
        course.week,
        courseStudentList
      );
      alert("Course added successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to add course");
    }
  };

  const handleModifyCourse = async (e, courseID) => {
    e.preventDefault();
    setCurrentCourseID(courseID);
    setIsModifyFormOpen(true);
  };

  const handleDeleteCourse = async (e, courseID) => {
    e.preventDefault();
    try {
      await doDeleteCourse(courseID);
      alert("Course deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete course");
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
        setStudentList(studentList);
      },
      (error) => {
        console.log(error);
      }
    );

    const queryLecturer = query(collection(db, "lecturer"));

    const unsubscribeLecturer = onSnapshot(
      queryLecturer,
      (snapShot) => {
        let lecturerList = [];
        snapShot.docs.forEach((doc) => {
          lecturerList.push({ id: doc.id, ...doc.data() });
        });
        setLecturerList(lecturerList);
      },
      (error) => {
        console.log(error);
      }
    );

    const queryRoom = query(collection(db, "room"));

    const unsubscribeRoom = onSnapshot(
      queryRoom,
      (snapShot) => {
        let roomList = [];
        snapShot.docs.forEach((doc) => {
          roomList.push({ id: doc.id, ...doc.data() });
        });
        setRoomList(roomList);
      },
      (error) => {
        console.log(error);
      }
    );

    const queryCourse = query(collection(db, "course"));

    const unsubscribeCourse = onSnapshot(
      queryCourse,
      async (snapShot) => {
        let courseList = [];
        const promises = snapShot.docs.map((doc) => {
          const lecturerID = doc.data().lecturerID;
          return doGetLecturerName(lecturerID).then((lecturerName) => {
            courseList.push({
              id: doc.id,
              ...doc.data(),
              lecturerName: lecturerName,
            });
          });
        });

        await Promise.all(promises);
        setCourseList(courseList);
        console.log(courseList);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubscribeLecturer();
      unsubscribeRoom();
      unsubscribeStudent();
      unsubscribeCourse();
    };
  }, []);

  return (
    <div>
      <h1>Course&apos;s List</h1>
      {courseList.map((course) => (
        <p key={course.id}>
          <Link to={`/admin/detailCourse/${course.code}`}>
            {course.code} - {course.name} - {course.lecturerName}
          </Link>
          <button onClick={(e) => handleModifyCourse(e, course.id)}>
            Modify
          </button>
          <button onClick={(e) => handleDeleteCourse(e, course.id)}>
            Delete
          </button>
        </p>
      ))}
      {isModifyFormOpen && (
        <ModifyCourseForm
          courseID={currentCourseID}
          closeForm={() => setIsModifyFormOpen(false)}
          roomList={roomList}
          lecturerList={lecturerList}
          studentList={studentList}
          courseIDList={courseList.map((course) => course.code)}
        />
      )}
      <h1>Add Course</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Room</label>
        <select
          onChange={(e) => setCourse({ ...course, roomID: e.target.value })}
        >
          <option value="">Select Room</option>
          {roomList.map((room) => (
            <option key={room.id} value={room.id}>
              {room.id}
            </option>
          ))}
        </select>
        <label>Lecturer</label>
        <select
          onChange={(e) => setCourse({ ...course, lecturerID: e.target.value })}
        >
          <option value="">Select Lecturer</option>
          {lecturerList.map((lecturer) => (
            <option key={lecturer.id} value={lecturer.id}>
              {lecturer.name}
            </option>
          ))}
        </select>
        <label>Code</label>
        <input
          type="text"
          onChange={(e) => setCourse({ ...course, code: e.target.value })}
        />
        <label>Name</label>
        <input
          type="text"
          onChange={(e) => setCourse({ ...course, name: e.target.value })}
        />
        <label>Online URL</label>
        <input
          type="text"
          onChange={(e) => setCourse({ ...course, onlineURL: e.target.value })}
        />
        <label>Start Day</label>
        <input
          type="date"
          value={course.startDay.toISOString().substring(0, 10)}
          onChange={(e) =>
            setCourse({ ...course, startDay: new Date(e.target.value) })
          }
        />
        <label>Start Time</label>
        <input
          type="time"
          onChange={(e) => setCourse({ ...course, startTime: e.target.value })}
        />
        <label>End Time</label>
        <input
          type="time"
          onChange={(e) => setCourse({ ...course, endTime: e.target.value })}
        />
        <label>Week</label>
        <input
          type="number"
          onChange={(e) =>
            setCourse({ ...course, week: Number(e.target.value) })
          }
        />
        <label>Student</label>
        <select
          multiple={true}
          value={courseStudentList}
          onChange={(e) => {
            const options = [...e.target.selectedOptions];
            const values = options.map((option) => option.value);
            setCourseStudentList(values);
          }}
        >
          {studentList.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
        <br />
        <button type="submit">Add Course</button>
      </form>
      <h3>Course Info</h3>
      <p>Room: {course.roomID}</p>
      <p>Lecturer: {course.lecturerID}</p>
      <p>Code: {course.code}</p>
      <p>Name: {course.name}</p>
      <p>Online URL: {course.onlineURL}</p>
      <p>Start Day: {course.startDay.toISOString().substring(0, 10)}</p>
      <p>Start Time: {course.startTime}</p>
      <p>End Time: {course.endTime}</p>
      <p>Week: {course.week}</p>
      <p>Student: </p>
      {courseStudentList.map((student) => (
        <p key={student}>{student}</p>
      ))}
    </div>
  );
}
