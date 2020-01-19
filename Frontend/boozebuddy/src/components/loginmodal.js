import React, { Component } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';

export default class LoginModal extends Component {
    render() {
        return (
            <Modal
                size="tiny"
                open={this.props.active}
                closeOnDimmerClick={true}
                onClose={() => { this.props.handleClose() }}>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Username</label>
                            <input placeholder="username..." />
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <input type="password" />
                        </Form.Field>
                        <Button type="submit" primary>Login</Button>
                        <Button onClick={() => { this.setState({ loginModalOpen: false }) }} color="red">Cancel</Button>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}