import React from "react";
import { Navbar, Nav, NavItem, Container } from "react-bootstrap";
import { connect } from "react-redux";
import RegisterModal from "./auth/register-modal.component";
import LoginModal from "./auth/login-modal.component";
import Logout from "./auth/log-out.component";
import { IUser } from "../../types/interfaces";

export interface HeaderProps {
  auth?: {
    isAuthenticated: boolean;
    user: IUser;
  };
}

export interface HeaderState {
  isOpen: boolean;
}

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props);
    this.state = { isOpen: false };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth!;

    const authLinks = () => {
      return (
        <>
          <NavItem>
            <Logout />
          </NavItem>
          <NavItem>
            <Navbar.Text>
              <strong>{user ? `ברוך הבא ${user.name}   ` : ""}</strong>
            </Navbar.Text>
          </NavItem>
        </>
      );
    };

    const guestLinks = () => {
      return (
        <>
          <NavItem>
            <RegisterModal />
          </NavItem>
          <NavItem>
            <LoginModal />
          </NavItem>
        </>
      );
    };
    return (
      <div>
        <div>
          <Navbar bg="primary" variant="dark">
            <Container>
              <Navbar.Brand href="/">Beshulim</Navbar.Brand>
              <Navbar.Toggle onClick={this.toggle} />
              <Navbar.Collapse>
                <Nav className="ml-auto" navbar>
                  {isAuthenticated ? authLinks() : guestLinks()}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(Header);
