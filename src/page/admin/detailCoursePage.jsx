import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebaseConfig";
import { onSnapshot, collection, where, query, doc } from "firebase/firestore";
import {
  doAddCourseInfo,
  doUpdateCourseOnlineLink,
  doDeleteDocument,
  doGetLecturerName,
} from "../../controller/firestoreController";
import DetailListStudentCourse from "./detailListStudentCourse";

export default function DetailCoursePage() {
  const { courseCode } = useParams();
  const [course, setCourse] = useState({});
  const [info, setInFo] = useState({ title: "", content: "" });
  const [infoList, setInfoList] = useState([{}]);
  const [onlineURL, setOnlineURL] = useState("");
  const [studentList, setStudentList] = useState([]);

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    console.log(info);
    try {
      await doAddCourseInfo(courseCode, info);
      console.log("Add info success");
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnlineLinkSubmit = async (e) => {
    e.preventDefault();
    try {
      await doUpdateCourseOnlineLink(courseCode, onlineURL);
      console.log("Add online link success");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteInfo = async (e, id) => {
    e.preventDefault();
    try {
      await doDeleteDocument("info", id);
      console.log("Delete info success");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const queryCourse = query(doc(db, "course", courseCode));

    const unsubscribeCourse = onSnapshot(queryCourse, (snapshot) => {
      console.log(snapshot.data());
      const lecturerID = snapshot.data().lecturerID;
      doGetLecturerName(lecturerID).then((lecturerName) => {
        setCourse({
          ...snapshot.data(),
          lecturerName: lecturerName,
        });
      });
    });

    const queryCourseStudent = query(
      collection(db, "courseStudent"),
      where("courseID", "==", courseCode)
    );

    const unsubscribeCourseStudent = onSnapshot(
      queryCourseStudent,
      (snapshot) => {
        let studentList = [];
        snapshot.docs.forEach((doc) => {
          studentList.push(doc.data().studentID);
        });
        console.log(studentList);
        setStudentList(studentList);
      }
    );

    const queryInfo = query(collection(db, "info"));

    const unsubscribeInfo = onSnapshot(
      queryInfo,
      (snapshot) => {
        let infoList = [];
        snapshot.docs.forEach((doc) => {
          if (doc.data().courseCode === courseCode) {
            infoList.push({ id: doc.id, ...doc.data() });
          }
        });
        setInfoList(infoList);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubscribeInfo();
      unsubscribeCourse();
      unsubscribeCourseStudent();
    };
  }, [courseCode]);

  return (
    <div>
      <h1>Manage Course Page</h1>
      {infoList.map((info, index) => (
        <div key={index}>
          <h3>{info.title}</h3>
          <p>{info.content}</p>
          <button onClick={(e) => handleDeleteInfo(e, info.id)}>Delete</button>
          <br />
        </div>
      ))}
      <form onSubmit={(e) => handleInfoSubmit(e)}>
        <label>Title</label>
        <input
          type="text"
          onChange={(e) => setInFo({ ...info, title: e.target.value })}
        />
        <br />
        <label>Content</label>
        <textarea
          type="text"
          onChange={(e) => setInFo({ ...info, content: e.target.value })}
        />
        <button type="submit">Add Information</button>
      </form>
      <h2>Add online link</h2>
      <label>Online Link</label>
      <input
        type="text"
        placeholder="Online Link"
        onChange={(e) => setOnlineURL(e.target.value)}
      />
      <button onClick={(e) => handleOnlineLinkSubmit(e)}>Submit</button>
      <br />
      <h2>Course Information</h2>
      <p>Course Code: {courseCode}</p>
      {Object.keys(course).length > 0 && (
        <>
          <p>Name: {course.name}</p>
          <p>Lecturer: {course.lecturerName}</p>
          <p>Room {course.roomID}</p>
          <p>Start Day: {course.startDay}</p>
          <p>Week: {course.week}</p>
          <p>Online Link: {course.onlineURL}</p>
          <p>Start Time: {course.startTime}</p>
          <p>End Time: {course.endTime}</p>
        </>
      )}
      {course ? (
        <DetailListStudentCourse
          studentList={studentList}
          courseCode={courseCode}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
