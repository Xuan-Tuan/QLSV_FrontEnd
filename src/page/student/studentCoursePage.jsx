import { useEffect, useState } from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../controller/authController";
import { doGetCourseFromStudentID } from "../../controller/firestoreController";

export default function StudentCoursePage() {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const [courseListInfo, setCourseListInfo] = useState([]);

  const handleClickCourse = (e, courseID) => {
    e.preventDefault();
    try {
      navigate(`/student/course/${courseID}`);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    const getCourseList = async () => {
      const courseList = await doGetCourseFromStudentID(currentUser.uid);
      // console.log("courseList: ", courseList);
      setCourseListInfo(courseList);
    };

    if (currentUser) {
      getCourseList();
    }
  }, [currentUser]);

  return (
    <div className="h-[calc(100vh-70px-50px)]">
      <div className=" text-base h-12 mt-8 font-bold text-left align-middle pl-10 text-blue-700">
        <div>
          <p>Danh sách môn học của bạn</p>
        </div>
      </div>
      <div className="h-[calc(100vh-60px-50px-64px-64px)] m-10 lg:mr-96 lg:ml-20 shadow-lg flex flex-col gap-5 p-5 overflow-y-scroll will-change-scroll">
        {courseListInfo.map((course, index) => (
          <div
            key={index}
            className="flex flex-row justify-between text-center items-center px-8 py-4 my-5 outline outline-4 outline-slate-50 hover:shadow-2xl  border-2"
          >
            <div className="flex flex-col text-start text-uit text-lg font-bold">
              <p>Môn học: {course.name}</p>
              <p>Giảng viên: {course.lecturerName}</p>
              <p>Thời gian: {course.startDay}</p>
            </div>
            <div>
              <div onClick={(e) => handleClickCourse(e, course.id)}>
                <IoArrowForwardCircleOutline
                  className="text-uit mr-10"
                  size={50}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
