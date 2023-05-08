import { Modal, Button } from "react-bootstrap"
import PropTypes from 'prop-types'

const ModalComponent = ({ show, loading, title, children, _handleSubmit, _hideModal, isUpdate, isActionShown=true}) => {
    return (
        <div>
            <Modal  
                size="lg"
                show={show}
                backdrop="static"
                animation={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                            {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
                <Modal.Footer>
                    {isActionShown && 
                        <Button onClick={_handleSubmit}>
                            {loading
                                ? (
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                )
                                : isUpdate ? "Update" : "Add"
                            }
                        </Button>
                    }
                    <Button onClick={_hideModal} variant="secondary">Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ModalComponent

ModalComponent.propTypes = {
    show: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    _handleSubmit: PropTypes.func.isRequired,
    _hideModal: PropTypes.func.isRequired,
    isUpdate: PropTypes.number,
    loading: PropTypes.bool
}