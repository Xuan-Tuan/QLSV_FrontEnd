import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { doSignOut } from "../../controller/authController";
import { doGetAccountInfo } from "../../controller/firestoreController";
import { useAuth } from "../../controller/authController";

export default function AccountInfor() {
  const { currentUser } = useAuth();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const handleLogOut = async (e) => {
    e.preventDefault();
    try {
      await doSignOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      currentUser.getIdTokenResult().then((idTokenResult) => {
        const { role } = idTokenResult.claims;
        doGetAccountInfo(currentUser.uid, role).then((result) => {
          setUserInfo({
            name: result.name,
            email: result.email,
            phoneNumber: result.phoneNumber,
            address: result.address,
          });
        });
      });
    }
  }, [currentUser]);

  return (
    <div className="h-[calc(100vh-60px-50px-64px-64px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className=" text-lg font-bold text-left align-middle pl-10 text-blue-700 ">
        Tài khoản của bạn
      </div>
      <div className=" flext flex-col space-y-4 span-4 bg-gray-100 rounded-xl py-8 px-6">
        <div className="text-lg font-bold bg-white rounded-lg px-6 py-2 text-uit text-center uppercase ">
          Thông tin tài khoản của bạn
        </div>
        <div className="flex flex-col items-start ml-6 space-y-4">
          <div>
            <span className="font-semibold">Họ tên: </span>
            {""}
            {userInfo.name}
          </div>
          <div>
            <span className="font-semibold">Email: </span>
            {""}
            {userInfo.email}
          </div>
          <div>
            <span className="font-semibold">Số điện thoại:</span> {""}{" "}
            {userInfo.phoneNumber}
          </div>
          <div>
            <span className="font-semibold">Địa chỉ: </span>
            {""}
            {userInfo.address}
          </div>
        </div>
        <div className="flex items-center justify-evenly">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-2xl mr-2">
            Chỉnh sửa
          </button>
          <NavLink
            to={"/login"}
            onClick={(e) => {
              handleLogOut(e);
            }}
          >
            <button className="bg-red-500 text-white px-4 py-2 rounded-2xl">
              Đăng xuất
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
