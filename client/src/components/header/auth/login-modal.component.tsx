import * as React from "react";
import { connect } from "react-redux";
import { login } from "../../../redux/actions/authActions";
import { clearErrors } from "../../../redux/actions/errorActions";
import { Button, Modal, Form, Alert, FormGroup, Nav } from "react-bootstrap";
import { IError, IUser } from "../../../types/interfaces";

export interface LoginModalProps {
  isAuthenticated: boolean | null;
  error: IError;
  login: (user: IUser) => void;
  clearErrors: () => void;
}

export interface LoginModalState {
  modal: boolean;
  email: string;
  password: string;
  msg: string | null;
}

class LoginModal extends React.Component<LoginModalProps, LoginModalState> {
  constructor(props: LoginModalProps) {
    super(props);
    this.state = {
      modal: false,
      email: "",
      password: "",
      msg: null,
    };
  }

  componentDidUpdate(prevProps: LoginModalProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === "LOGIN_FAIL") {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    // If authenticated, close modal
    if (this.state.modal) {
      if (isAuthenticated) {
        this.toggle();
      }
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal,
    });
  };

  onSubmit = (e: any) => {
    e.preventDefault();

    const { email, password } = this.state;

    const user = {
      email,
      password,
    };

    // Attempt to login
    this.props.login(user);
  };

  render() {
    return (
      <div>
        <Nav.Link onClick={this.toggle} href="#">
          התחבר
        </Nav.Link>
        <Modal show={this.state.modal} onHide={this.toggle}>
          <Modal.Header>
            <Modal.Title style={{ margin: "auto" }}>התחברות למערכת</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <FormGroup>
                <Form.Label>כתובת אימייל</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  id="email"
                  placeholder="כתובת אימייל"
                  className="mb-3"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ email: e.target.value });
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Form.Label>סיסמא</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  id="password"
                  placeholder="סיסמא"
                  className="mb-3"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ password: e.target.value });
                  }}
                />
                {this.state.msg ? (
                  <Alert variant={"danger"}>{this.state.msg}</Alert>
                ) : null}
                <Button
                  onClick={this.onSubmit}
                  color="dark"
                  style={{ marginTop: "2rem" }}
                  block
                >
                  התחבר
                </Button>
              </FormGroup>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});

const mapDispatchToProps = (dispatch: Function) => ({
  login: (user: IUser) => dispatch(login(user)),
  clearErrors: () => dispatch(clearErrors()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
