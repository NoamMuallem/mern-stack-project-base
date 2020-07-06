import React from "react";
import { connect } from "react-redux";
import { logout } from "../../../redux/actions/authActions";
import { Nav } from "react-bootstrap";

export interface LogoutProps {
  logout: () => void;
}

const Logout: React.SFC<LogoutProps> = ({ logout }: LogoutProps) => {
  return (
    <>
      <Nav.Link onClick={logout} href="#">
        התנתק
      </Nav.Link>
    </>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  logout: () => dispatch(logout()),
});

export default connect(null, mapDispatchToProps)(Logout);
