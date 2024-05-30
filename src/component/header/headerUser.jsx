import Logo from "../../assets/LOGO.png";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import UserProfile from "../account/userProfile";
import { useAuth } from "../../controller/authController";

export default function HeaderUser() {
  const { currentUser } = useAuth();
  const navLinkClass = ({ isActive }) =>
    isActive ? "text-red-500" : "text-white";
  const [role, setRole] = useState();

  useEffect(() => {
    if (currentUser) {
      currentUser.getIdTokenResult().then((idTokenResult) => {
        const { role } = idTokenResult.claims;
        setRole(role);
      });
    }
  }, [currentUser]);

  return (
    <header className="bg-uit h-20 text-white flex items-center justify-between p-4">
      <div className="flex items-center">
        <div className="mr-8">
          <NavLink to={`/${role}`}>
            <img src={Logo} alt="LOGO" className="h-12 w-auto" />
          </NavLink>
        </div>
        <div className="flex flex-col text-xs lg:text-base font-bold uppercase">
          <div className="text-lg">Hệ thống quản lý sinh viên</div>
        </div>
      </div>
      <div className="flex items-center justify-between flex-grow">
        <nav className="text-xs lg:text-base font-bold flex-grow text-center">
          <NavLink to={`/${role}/course`} className={navLinkClass}>
            Môn học
          </NavLink>
        </nav>
        <nav className="text-xs lg:text-base font-bold flex-grow text-center">
          <NavLink to={`/${role}/account`} className={navLinkClass}>
            Tài khoản
          </NavLink>
        </nav>
        <div className="flex items-center space-x-4">
          <div>
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="rounded-full pl-4 pr-8 py-1 text-black"
              aria-label="Tìm kiếm"
            />
          </div>
          <div>
            <NavLink to={`/${role}`}>
              <UserProfile />
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
