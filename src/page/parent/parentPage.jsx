import HeaderUser from "../../component/header/headerUser";
import Footer from "../../component/footer/footer";
import PropTypes from "prop-types";

ParentPage.propTypes = {
  children: PropTypes.object,
};

export default function ParentPage({ children }) {
  return (
    <>
      <div className="flex flex-col ">
        <HeaderUser />

        <div>{children}</div>

        <Footer />
      </div>
    </>
  );
}
