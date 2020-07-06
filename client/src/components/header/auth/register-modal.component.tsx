import * as React from "react";
import { connect } from "react-redux";
import { register } from "../../../redux/actions/authActions";
import { clearErrors } from "../../../redux/actions/errorActions";
import { Button, Modal, Form, Alert, FormGroup, Nav } from "react-bootstrap";
import { IError, IUser } from "../../../types/interfaces";

export interface RegistrationModalProps {
  isAuthenticated: boolean | null;
  error: IError;
  register: (user: IUser) => void;
  clearErrors: () => void;
}

export interface RegistrationModalState {
  modal: boolean;
  name: string;
  email: string;
  password: string;
  msg: string | null;
}

class RegistrationModal extends React.Component<
  RegistrationModalProps,
  RegistrationModalState
> {
  constructor(props: RegistrationModalProps) {
    super(props);
    this.state = {
      modal: false,
      name: "",
      email: "",
      password: "",
      msg: null,
    };
  }

  componentDidUpdate(prevProps: RegistrationModalProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === "REGISTER_FAIL") {
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

    const { name, email, password } = this.state;

    if (password.length > 8) {
      // Create user object
      const newUser = {
        name,
        email,
        password,
      };

      // Attempt to register
      this.props.register(newUser);
    } else {
      this.setState({ msg: "הסיסמא צריכה להיות באורך 8 תוים לפחות" });
    }
  };

  render() {
    return (
      <div>
        <Nav.Link onClick={this.toggle} href="#">
          הרשמה
        </Nav.Link>

        <Modal show={this.state.modal} onHide={this.toggle}>
          <Modal.Header>
            <Modal.Title style={{ margin: "auto" }}>הרשמה למערכת</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <FormGroup>
                <Form.Label>שם מלא</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  id="name"
                  placeholder="שם מלא"
                  className="mb-3"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ name: e.target.value });
                  }}
                />
              </FormGroup>

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
                  הירשם
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
  register: (user: IUser) => dispatch(register(user)),
  clearErrors: () => dispatch(clearErrors()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationModal);
