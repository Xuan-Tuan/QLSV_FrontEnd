import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  documentId,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { formattedDate } from "./formattedDate";

// lấy sĩ số của lớp học mà giáo viên đang giảng dạy
async function getStudentCount(courseCode) {
  try {
    const courseStudentRef = collection(db, "courseStudent");
    const courseStudentQuery = query(
      courseStudentRef,
      where("courseID", "==", courseCode)
    );
    const querySnapshot = await getDocs(courseStudentQuery);

    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting student count: ", error);
    throw error;
  }
}
// lấy uid của lịch dạy học hôm nay (schedule)
async function getScheduleToday(courseID, Day) {
  try {
    const scheduleRef = collection(db, "schedule");
    const scheduleQuery = query(
      scheduleRef,
      where("courseID", "==", courseID),
      where("date", "==", Day)
    );
    const querySnapshot = await getDocs(scheduleQuery);

    if (!querySnapshot.empty) {
      const schedule = querySnapshot.docs[0];
      return schedule.id;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting schedule: ", error);
    throw error;
  }
}
// lấy số lượng sinh viên đã điểm danh của lớp học
async function getAttendedStudentCount(scheduleUID) {
  try {
    const attendanceRef = collection(db, "attendance");
    const attendanceQuery = query(
      attendanceRef,
      where("scheduleID", "==", scheduleUID),
      where("attended", "==", true)
    );
    const querySnapshot = await getDocs(attendanceQuery);

    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting attendance count: ", error);
    throw error;
  }
}
async function doGetCourseLecturer(lecturerID) {
  const courseRef = collection(db, "course");
  const courseQuery = query(courseRef, where("lecturerID", "==", lecturerID));
  const courseSnap = await getDocs(courseQuery);

  if (!courseSnap.empty) {
    let courseList = [];
    courseSnap.forEach((doc) => {
      courseList.push({ id: doc.id, ...doc.data() });
    });
    return courseList;
  } else {
    return null;
  }
}

async function doAddScheduleCourse(
  courseID,
  startDay,
  week,
  courseStudentList
) {
  const generateSchedule = (startDay, week) => {
    let schedule = [];
    for (let i = 0; i < week; i++) {
      schedule.push({
        date: new Date(startDay.getTime() + i * 7 * 24 * 60 * 60 * 1000),
      });
    }
    return schedule;
  };

  const scheduleRef = collection(db, "schedule");
  const attendanceRef = collection(db, "attendance");

  const scheduleList = generateSchedule(startDay, week);
  scheduleList.forEach(async (schedule) => {
    const scheduleQuery = await addDoc(scheduleRef, {
      courseID: courseID,
      date: formattedDate(schedule.date),
    });

    console.log(scheduleQuery.id);

    courseStudentList.forEach(async (student) => {
      const attendanceQuery = await addDoc(attendanceRef, {
        courseID: courseID,
        studentID: student,
        scheduleID: scheduleQuery.id,
        attended: false,
      });
      console.log(attendanceQuery);
    });
  });
}

async function doAddCourseStudent(courseID, courseStudentList) {
  const courseStudentRef = collection(db, "courseStudent");
  courseStudentList.forEach(async (student) => {
    const docRef = await addDoc(courseStudentRef, {
      courseID: courseID,
      studentID: student,
    });
    console.log(docRef);
  });
}

async function doAddRoom(room) {
  const roomRef = doc(db, "room", room);
  const roomQuery = await setDoc(roomRef, {});
  return roomQuery;
}

async function doAddCourse(course) {
  const courseField = {
    roomID: course.roomID,
    lecturerID: course.lecturerID,
    code: course.code,
    name: course.name,
    onlineURL: course.onlineURL,
    startDay: formattedDate(course.startDay),
    week: course.week,
    startTime: course.startTime,
    endTime: course.endTime,
  };
  const courseRef = doc(db, "course", course.code);
  const courseQuery = await setDoc(courseRef, courseField);
  return courseQuery;
}

async function doAddCourseInfo(courseCode, info) {
  const infoRef = collection(db, "info");
  const infoQuery = await addDoc(infoRef, {
    courseCode: courseCode,
    title: info.title,
    content: info.content,
  });
  return infoQuery;
}

async function doUpdateCourseOnlineLink(courseCode, onlineURL) {
  const courseOnlLinkRef = doc(db, "course", courseCode);
  const courseOnlLinkQuery = await updateDoc(courseOnlLinkRef, {
    onlineURL: onlineURL,
  });
  return courseOnlLinkQuery;
}

// async function doGetStudentInfoLecturer(studentListID, courseCode) {
//   const studentList = [];

//   if (studentListID.length === 0) {
//     console.log("Không có sinh viên nào trong studentListID");
//     return studentList;
//   }

//   const attendanceRef = collection(db, "attendance");
//   const studentRef = collection(db, "student");
//   const studentQuery = query(
//     studentRef,
//     where(documentId(), "in", studentListID)
//   );

//   const studentSnap = await getDocs(studentQuery);
//   studentSnap.forEach((doc) => {
//     studentList.push({ id: doc.id, name: doc.data().name });
//   });
//   console.log("Truy van sinh vien", studentList);

//   const studentListResult = await Promise.all(
//     studentList.map(async (student) => {
//       const attendanceQuery = query(
//         attendanceRef,
//         where("studentID", "==", student.id),
//         where("courseID", "==", courseCode)
//       );

//       const attendedQuery = query(
//         attendanceRef,
//         where("studentID", "==", student.id),
//         where("courseID", "==", courseCode),
//         where("attended", "!=", false)
//       );

//       const attendanceSnap = await getCountFromServer(attendanceQuery);
//       console.log("sum sv", attendanceSnap);
//       const attendedSnap = await getCountFromServer(attendedQuery);
//       console.log("sum sv dd", attendedSnap);

//       return {
//         ...student,
//         attended: attendedSnap.data().count,
//         total: attendanceSnap.data().count,
//       };
//     })
//   );
//   console.log("co", total);
//   console.log("dd", attended);
//   console.log("ket qua ham", studentListResult);
//   return studentListResult;
// }

async function doGetStudentInfoLecturer(studentListID, courseCode) {
  const studentList = [];

  if (studentListID.length === 0) {
    console.log("Không có sinh viên nào trong studentListID");
    return studentList;
  }

  try {
    const attendanceRef = collection(db, "attendance");
    const studentRef = collection(db, "student");
    const studentQuery = query(
      studentRef,
      where(documentId(), "in", studentListID)
    );

    const studentSnap = await getDocs(studentQuery);

    studentSnap.forEach((doc) => {
      // console.log("data", doc.data());
      studentList.push({
        id: doc.id,
        name: doc.data().name,
        phoneNumber: doc.data().phoneNumber,
        address: doc.data().address,
      });
    });

    console.log("Truy van sinh vien", studentList);

    const studentListResult = await Promise.all(
      studentList.map(async (student) => {
        try {
          const attendanceQuery = query(
            attendanceRef,
            where("studentID", "==", student.id),
            where("courseID", "==", courseCode)
          );
          // console.log(
          //   "attendanceQuery for student",
          //   student.id,
          //   attendanceQuery
          // );

          const attendedQuery = query(
            attendanceRef,
            where("studentID", "==", student.id),
            where("courseID", "==", courseCode),
            where("attended", "==", true)
          );
          // console.log("attendedQuery for student", student.id, attendedQuery);

          const attendanceSnap = await getCountFromServer(attendanceQuery);
          // console.log(
          //   `sum sv for student ${student.id}`,
          //   attendanceSnap.data()
          // );

          const attendedSnap = await getCountFromServer(attendedQuery);
          // console.log(
          //   `sum sv dd for student ${student.id}`,
          //   attendedSnap.data()
          // );

          const total = attendanceSnap.data() ? attendanceSnap.data().count : 0;
          const attended = attendedSnap.data() ? attendedSnap.data().count : 0;

          return {
            ...student,
            attended: attended,
            total: total,
          };
        } catch (error) {
          console.error(
            `Error fetching attendance data for student ${student.id}:`,
            error
          );
          return {
            ...student,
            attended: 0,
            total: 0,
          };
        }
      })
    );

    console.log("Ket qua tra ve: ", studentListResult);
    return studentListResult;
  } catch (error) {
    console.error("Error fetching student data:", error);
    return [];
  }
}

async function doGetStudentFromParent(parentID) {
  const studentRef = collection(db, "student");
  const studentQuery = query(studentRef, where("parentID", "==", parentID));
  const studentSnap = await getDocs(studentQuery);
  if (studentSnap.empty) {
    return null;
  } else {
    let studentList = [];
    studentSnap.forEach((doc) => {
      studentList.push({ id: doc.id, ...doc.data() });
    });
    return studentList;
  }
}

async function doGetAccountInfo(UID, role) {
  const accountRef = collection(db, role);
  const accountQuery = query(accountRef, where(documentId(), "==", UID));
  const accountSnap = await getDocs(accountQuery);
  if (accountSnap.empty) {
    return null;
  } else {
    let accountInfo = {};
    accountSnap.docs.forEach((doc) => {
      accountInfo = { id: doc.id, ...doc.data() };
    });
    return accountInfo;
  }
}

async function doGetCourseFromStudentID(studentID) {
  const courseStudentRef = collection(db, "courseStudent");
  const courseStudentQuery = query(
    courseStudentRef,
    where("studentID", "==", studentID)
  );

  const courseStudentSnap = await getDocs(courseStudentQuery);

  let courseIDList = [];

  courseStudentSnap.forEach((doc) => {
    courseIDList.push(doc.data().courseID);
  });

  const courses = await Promise.all(
    courseIDList.map(async (courseID) => {
      const courseRef = doc(db, "course", courseID);
      const courseQuery = await getDoc(courseRef);
      const courseData = courseQuery.data();
      const lecturerID = courseData.lecturerID;
      const lecturerRef = doc(db, "lecturer", lecturerID);
      const lecturerQuery = await getDoc(lecturerRef);
      const lecturerData = lecturerQuery.data();
      const lecturerName = lecturerData.name;
      return {
        id: courseQuery.id,
        name: courseData.name,
        lecturerName: lecturerName,
        startDay: courseData.startDay,
      };
    })
  );

  return courses;
}

async function doGetCourseDetail(courseID) {
  const courseRef = doc(db, "course", courseID);
  const courseQuery = await getDoc(courseRef);
  const courseData = courseQuery.data();
  const lecturerID = courseData.lecturerID;
  const lecturerRef = doc(db, "lecturer", lecturerID);
  const lecturerQuery = await getDoc(lecturerRef);
  const lecturerData = lecturerQuery.data();
  const lecturerName = lecturerData.name;
  return {
    id: courseQuery.id,
    lecturerName: lecturerName,
    ...courseData,
  };
}

async function doGetScheduleFromCourseID(courseID, currentDay) {
  // console.log("courseID: ", courseID);
  // console.log("currentDay: ", currentDay);

  const scheduleRef = collection(db, "schedule");
  const scheduleQuery = query(
    scheduleRef,
    where("courseID", "==", courseID),
    where("date", "==", currentDay)
  );
  const scheduleSnap = await getDocs(scheduleQuery);

  if (scheduleSnap.empty) {
    console.log("No schedule");
    return null;
  } else {
    let scheduleList = [];
    scheduleSnap.forEach((doc) => {
      scheduleList.push({ id: doc.id, ...doc.data() });
    });
    // console.log(scheduleList[0].date);
    return scheduleList;
  }
}

async function doGetAttendStatusFromStudentID(studentID, courseID) {
  const attendanceRef = collection(db, "attendance");
  const attendanceQuery = query(
    attendanceRef,
    where("studentID", "==", studentID),
    where("courseID", "==", courseID)
  );
  const attendanceSnap = await getDocs(attendanceQuery);
  if (attendanceSnap.empty) {
    return null;
  } else {
    let attendanceList = [];
    attendanceSnap.forEach((doc) => {
      attendanceList.push({ id: doc.id, ...doc.data() });
    });
    const attendanceLength = attendanceList.length;
    const attendedLength = attendanceList.filter(
      (attendance) => attendance.attended === true
    ).length;
    return { attended: attendedLength, total: attendanceLength };
  }
}

async function doGetCourseFromCourseID(courseID) {
  const courseRef = doc(db, "course", courseID);
  const courseSnap = await getDoc(courseRef);
  if (courseSnap.exists()) {
    return { id: courseSnap.id, ...courseSnap.data() };
  }
}

async function doDeleteDocument(collectionName, documentID) {
  const docRef = doc(db, collectionName, documentID);
  const docQuery = await deleteDoc(docRef);
  return docQuery;
}

async function doAddDevice(device) {
  const deviceRef = doc(db, "device", device.id.toString());
  const deviceQuery = await setDoc(deviceRef, {
    roomID: device.roomID,
    status: device.status,
  });
  return deviceQuery;
}

async function doDeleteParentOfStudent(parentID) {
  const studentRef = collection(db, "student");
  const studentQuery = query(studentRef, where("parentID", "==", parentID));
  const studentSnap = await getDocs(studentQuery);
  if (studentSnap.empty) {
    return null;
  } else {
    studentSnap.forEach(async (doc) => {
      await updateDoc(doc.ref, { parentID: "" });
    });
  }
}

async function doDeleteCourse(courseID) {
  const courseRef = doc(db, "course", courseID);
  const infoRef = collection(db, "info");
  const courseStudentRef = collection(db, "courseStudent");
  const scheduleRef = collection(db, "schedule");
  const attendanceRef = collection(db, "attendance");

  const courseStudentQuery = query(
    courseStudentRef,
    where("courseID", "==", courseID)
  );
  const infoQuery = query(infoRef, where("courseID", "==", courseID));
  const scheduleQuery = query(scheduleRef, where("courseID", "==", courseID));
  const attendanceQuery = query(
    attendanceRef,
    where("courseID", "==", courseID)
  );

  const infoSnap = await getDocs(infoQuery);
  const courseStudentSnap = await getDocs(courseStudentQuery);
  const scheduleSnap = await getDocs(scheduleQuery);
  const attendanceSnap = await getDocs(attendanceQuery);

  if (!infoSnap.empty) {
    infoSnap.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }

  if (!courseStudentSnap.empty) {
    courseStudentSnap.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }

  if (!scheduleSnap.empty) {
    scheduleSnap.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }

  if (!attendanceSnap.empty) {
    attendanceSnap.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }

  const courseQuery = await deleteDoc(courseRef);

  return courseQuery;
}

const doGetDeviceData = async (deviceID) => {
  const deviceRef = doc(db, "device", deviceID);
  const deviceQuery = await getDoc(deviceRef);
  return { id: deviceQuery.id, ...deviceQuery.data() };
};

const updateDeviceData = async (deviceID, deviceData) => {
  const deviceRef = doc(db, "device", deviceID);
  const deviceQuery = await updateDoc(deviceRef, deviceData);
  return deviceQuery;
};

const doDeleteRoom = async (roomID) => {
  const roomRef = doc(db, "room", roomID);
  const deviceRef = collection(db, "device");
  const courseRef = collection(db, "course");
  const deviceQuery = query(deviceRef, where("roomID", "==", roomID));
  const courseQuery = query(courseRef, where("roomID", "==", roomID));
  const courseSnap = await getDocs(courseQuery);
  const deviceSnap = await getDocs(deviceQuery);
  if (!courseSnap.empty) {
    courseSnap.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }
  if (!deviceSnap.empty) {
    deviceSnap.forEach(async (doc) => {
      await updateDoc(doc.ref, { roomID: "" });
    });
  }
  const roomQuery = await deleteDoc(roomRef);
  return roomQuery;
};

const doGetLecturerData = async (lecturerID) => {
  const lecturerRef = doc(db, "lecturer", lecturerID);
  const lecturerQuery = await getDoc(lecturerRef);
  return { id: lecturerQuery.id, ...lecturerQuery.data() };
};

const doUpdateLecturerData = async (lecturerID, lecturerData) => {
  const lecturerRef = doc(db, "lecturer", lecturerID);
  const lecturerQuery = await updateDoc(lecturerRef, lecturerData);
  return lecturerQuery;
};

const doDeleteLecturer = async (lecturerID) => {
  const lecturerRef = doc(db, "lecturer", lecturerID);
  const authLecturerRef = doc(db, "authentication", lecturerID);
  const courseRef = collection(db, "course");
  const courseQuery = query(courseRef, where("lecturerID", "==", lecturerID));
  const courseSnap = await getDocs(courseQuery);
  if (!courseSnap.empty) {
    courseSnap.forEach(async (doc) => {
      await updateDoc(doc.ref, { lecturerID: "" });
    });
  }
  await deleteDoc(authLecturerRef);
  const lecturerQuery = await deleteDoc(lecturerRef);
  return lecturerQuery;
};

const doGetParentData = async (parentID) => {
  const parentRef = doc(db, "parent", parentID);
  const parentQuery = await getDoc(parentRef);
  return { id: parentQuery.id, ...parentQuery.data() };
};

const doUpdateParentData = async (parentID, parentData) => {
  const parentRef = doc(db, "parent", parentID);
  const parentQuery = await updateDoc(parentRef, parentData);
  return parentQuery;
};

const doDeleteStudent = async (studentID, parentID) => {
  const studentRef = doc(db, "student", studentID);
  const authStudentRef = doc(db, "authentication", studentID);
  const courseStudentRef = collection(db, "courseStudent");
  const attendanceRef = collection(db, "attendance");

  if (parentID) {
    const parentRef = doc(db, "parent", parentID);
    await updateDoc(parentRef, { hasChild: false });
  }

  const courseStudentQuery = query(
    courseStudentRef,
    where("studentID", "==", studentID)
  );
  const attendanceQuery = query(
    attendanceRef,
    where("studentID", "==", studentID)
  );

  const courseStudentSnap = await getDocs(courseStudentQuery);
  const attendanceSnap = await getDocs(attendanceQuery);

  if (!courseStudentSnap.empty) {
    courseStudentSnap.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }

  if (!attendanceSnap.empty) {
    attendanceSnap.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }

  await deleteDoc(authStudentRef);
  const studentQuery = await deleteDoc(studentRef);
  return studentQuery;
};

const doGetStudentData = async (studentID) => {
  const studentRef = doc(db, "student", studentID);
  const studentQuery = await getDoc(studentRef);
  const parentID = studentQuery.data().parentID;
  const parentRef = doc(db, "parent", parentID);
  const parentQuery = await getDoc(parentRef);
  const result = {
    ...studentQuery.data(),
    parentName: parentQuery.data().name,
    id: studentQuery.id,
  };
  return result;
};

const doUpdateStudentData = async (studentID, studentData, oldParentID) => {
  const studentRef = doc(db, "student", studentID);
  const studentQuery = await updateDoc(studentRef, studentData);

  const oldParentRef = doc(db, "parent", oldParentID);
  await updateDoc(oldParentRef, { hasChild: false });

  const parentID = studentData.parentID;
  const parentRef = doc(db, "parent", parentID);
  await updateDoc(parentRef, { hasChild: true });

  return studentQuery;
};

async function doGetLecturerName(lecturerID) {
  const lecturerRef = doc(db, "lecturer", lecturerID);
  const lecturerQuery = await getDoc(lecturerRef);
  return lecturerQuery.data().name;
}

async function doGetStudentFromCourseID(courseID) {
  const courseStudentRef = collection(db, "courseStudent");
  const courseStudentQuery = query(
    courseStudentRef,
    where("courseID", "==", courseID)
  );
  const courseStudentSnap = await getDocs(courseStudentQuery);
  if (courseStudentSnap.empty) {
    return null;
  } else {
    let studentList = [];
    courseStudentSnap.forEach((doc) => {
      studentList.push(doc.data().studentID);
    });
    return studentList;
  }
}

async function doUpdateCourseData(courseID, courseData) {
  const courseRef = doc(db, "course", courseID);
  const courseQuery = await updateDoc(courseRef, courseData);
  return courseQuery;
}

async function doUpdateCourseStudentList(courseID, newCourseStudentList) {
  console.log("newCourseStudentList: ", newCourseStudentList);

  const scheduleRef = collection(db, "schedule");
  const courseStudentRef = collection(db, "courseStudent");
  const attendanceRef = collection(db, "attendance");

  const scheduleQuery = query(scheduleRef, where("courseID", "==", courseID));
  const scheduleSnap = await getDocs(scheduleQuery);
  let scheduleList = [];
  scheduleSnap.forEach((doc) => {
    scheduleList.push(doc.id);
  });

  const courseStudentQuery = query(
    courseStudentRef,
    where("courseID", "==", courseID)
  );
  const oldCourseStudentSnap = await getDocs(courseStudentQuery);
  const oldCourseStudentList = [];
  if (!oldCourseStudentSnap.empty) {
    oldCourseStudentSnap.forEach((doc) => {
      console.log(doc.data().studentID);
      oldCourseStudentList.push(doc.data().studentID);
    });
  }
  console.log("oldCourseStudentList: ", oldCourseStudentList);

  const removeCourseStudentList = oldCourseStudentList.filter(
    (studentID) => !newCourseStudentList.includes(studentID)
  );
  const addCourseStudentList = newCourseStudentList.filter(
    (studentID) => !oldCourseStudentList.includes(studentID)
  );

  if (removeCourseStudentList) {
    console.log("removeCourseStudentList: ", removeCourseStudentList);
    const removeCourseListQuery = query(
      courseStudentRef,
      where("studentID", "in", removeCourseStudentList),
      where("courseID", "==", courseID)
    );

    const removeAttendanceListQuery = query(
      attendanceRef,
      where("studentID", "in", removeCourseStudentList),
      where("courseID", "==", courseID)
    );

    let removeCSList = [];
    const removeCourseListSnap = await getDocs(removeCourseListQuery);
    removeCourseListSnap.forEach((doc) => {
      removeCSList.push(doc.ref);
    });
    removeCSList.map(async (ref) => {
      await deleteDoc(ref);
    });

    let removeADList = [];
    const removeAttendanceListSnap = await getDocs(removeAttendanceListQuery);
    removeAttendanceListSnap.forEach((doc) => {
      removeADList.push(doc.ref);
    });
    removeADList.map(async (ref) => {
      await deleteDoc(ref);
    });
  }

  if (addCourseStudentList) {
    console.log("addCourseStudentList: ", addCourseStudentList);
    const courseStudentRef = collection(db, "courseStudent");
    addCourseStudentList.map(async (studentID) => {
      await addDoc(courseStudentRef, {
        courseID: courseID,
        studentID: studentID,
      });
      scheduleList.map(async (scheduleID) => {
        await addDoc(attendanceRef, {
          courseID: courseID,
          studentID: studentID,
          scheduleID: scheduleID,
          attended: false,
        });
      });
    });
  }
}

export {
  getStudentCount,
  getScheduleToday,
  getAttendedStudentCount,
  doAddRoom,
  doAddCourse,
  doAddCourseStudent,
  doAddScheduleCourse,
  doGetCourseLecturer,
  doAddCourseInfo,
  doUpdateCourseOnlineLink,
  doGetStudentInfoLecturer,
  doGetStudentFromParent,
  doGetAccountInfo,
  doGetCourseFromStudentID,
  doGetCourseDetail,
  doGetScheduleFromCourseID,
  doGetAttendStatusFromStudentID,
  doGetCourseFromCourseID,
  doDeleteDocument,
  doAddDevice,
  doDeleteParentOfStudent,
  doDeleteCourse,
  doGetDeviceData,
  updateDeviceData,
  doDeleteRoom,
  doGetLecturerData,
  doUpdateLecturerData,
  doGetParentData,
  doUpdateParentData,
  doDeleteLecturer,
  doDeleteStudent,
  doGetStudentData,
  doUpdateStudentData,
  doGetLecturerName,
  doGetStudentFromCourseID,
  doUpdateCourseData,
  doUpdateCourseStudentList,
};
