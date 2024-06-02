import HeaderAdmin from "../../component/header/headerAdmin";
import Footer from "../../component/footer/footer";
import PropTypes from "prop-types";
import Navbar from "../../component/header/navBar";
import ToolBar from "../../component/header/toolBar";

AdminPage.propTypes = {
  children: PropTypes.object,
};

export default function AdminPage({ children }) {
  // return (
  //   <>
  //     <HeaderAdmin />
  //     <div className="mt-[70px] mb-[50px]">{children}</div>
  //     <Footer />
  //   </>
  // );
  return (
    <>
      <ToolBar />
      <Navbar />
      <div className="mt-20 ml-52 p-10">{children}</div>
    </>
  );
}
