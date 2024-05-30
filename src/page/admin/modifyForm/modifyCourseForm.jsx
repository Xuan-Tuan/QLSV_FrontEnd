import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  doGetCourseFromCourseID,
  doGetStudentFromCourseID,
  doUpdateCourseData,
  doUpdateCourseStudentList,
} from "../../../controller/firestoreController";
import { convertDateFormat } from "../../../controller/formattedDate";

ModifyCourseForm.propTypes = {
  courseID: PropTypes.string.isRequired,
  closeForm: PropTypes.func.isRequired,
  roomList: PropTypes.array.isRequired,
  lecturerList: PropTypes.array.isRequired,
  studentList: PropTypes.array.isRequired,
  courseStudentList: PropTypes.array.isRequired,
};

function ModifyCourseForm({
  courseID,
  closeForm,
  roomList,
  lecturerList,
  studentList,
}) {
  const [courseData, setCourseData] = useState({
    code: "",
    name: "",
    roomID: "",
    lecturerID: "",
    onlineURL: "",
    startTime: "",
    endTime: "",
  });
  const [courseStudents, setCourseStudents] = useState([]);

  const handleInputCourseChange = (event) => {
    const { name, value } = event.target;
    setCourseData((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  const currentDate = new Date();
  let startDate = useRef(new Date());

  useEffect(() => {
    doGetCourseFromCourseID(courseID).then((course) => {
      setCourseData(course);
      startDate.current = new Date(convertDateFormat(course.startDay));
    });
    doGetStudentFromCourseID(courseID).then((students) => {
      setCourseStudents(students);
    });
  }, [courseID]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (
        courseData.roomID === "" ||
        courseData.lecturerID === "" ||
        courseData.code === "" ||
        courseData.name === "" ||
        courseData.startTime === "" ||
        courseData.endTime === ""
      ) {
        alert("Please fill all the fields");
        return;
      }
      if (courseStudents.length === 0) {
        alert("Please select at least one student");
        return;
      }
      if (courseData.startTime >= courseData.endTime) {
        alert("End time must be after start time");
        return;
      }
      if (courseData.week < 1 || courseData.week > 16) {
        alert("Week must be between 1 and 16");
        return;
      }
      if (startDate.current < currentDate) {
        alert("Start day must be in the future");
        return;
      }
      await doUpdateCourseData(courseID, courseData);
      await doUpdateCourseStudentList(courseID, courseStudents);
      alert("Course updated successfully");
      closeForm();
    } catch (error) {
      console.log(error);
      alert("Failed to update course");
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <label>Room</label>
      <select
        name="roomID"
        value={courseData.roomID}
        onChange={(e) => handleInputCourseChange(e)}
      >
        <option value="">Select Room</option>
        {roomList &&
          roomList.map((room) => (
            <option key={room.id} value={room.id}>
              {room.id}
            </option>
          ))}
      </select>
      <label>Lecturer</label>
      <select
        name="lecturerID"
        value={courseData.lecturerID}
        onChange={(e) => handleInputCourseChange(e)}
      >
        <option value="">Select Lecturer</option>
        {lecturerList &&
          lecturerList.map((lecturer) => (
            <option key={lecturer.id} value={lecturer.id}>
              {lecturer.name}
            </option>
          ))}
      </select>
      <label>Code</label>
      <input
        type="text"
        name="code"
        value={courseData.code}
        onChange={(e) => handleInputCourseChange(e)}
        disabled
      />
      <label>Name</label>
      <input
        type="text"
        name="name"
        value={courseData.name}
        onChange={(e) => handleInputCourseChange(e)}
      />
      <label>Online URL</label>
      <input
        type="text"
        name="onlineURL"
        value={courseData.onlineURL}
        onChange={(e) => handleInputCourseChange(e)}
      />
      <label>Start Day</label>
      <input
        type="date"
        name="startDay"
        value={convertDateFormat(courseData.startDay)}
        disabled
      />
      <label>Start Time</label>
      <input
        type="time"
        name="startTime"
        value={courseData.startTime}
        onChange={(e) => handleInputCourseChange(e)}
      />
      <label>End Time</label>
      <input
        type="time"
        name="endTime"
        value={courseData.endTime}
        onChange={(e) => handleInputCourseChange(e)}
      />
      <label>Week</label>
      <input
        type="number"
        name="week"
        value={courseData.week}
        onChange={(e) => handleInputCourseChange(e)}
        disabled
      />
      <label>Student</label>
      <select
        multiple={true}
        value={courseStudents}
        onChange={(e) => {
          const options = [...e.target.selectedOptions];
          const values = options.map((option) => option.value);
          setCourseStudents(values);
        }}
      >
        {studentList &&
          studentList.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
      </select>
      <br />
      <button type="submit">Submit</button>
      <button onClick={closeForm}>Cancel</button>
    </form>
  );
}

export default ModifyCourseForm;
