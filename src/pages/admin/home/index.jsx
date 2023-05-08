import { connect } from "react-redux"
import { useHistory } from "react-router"
import { useState } from 'react'
import { Modal, Button } from "react-bootstrap"
import { addBoard, deleteBoard, updateBoard } from "../../../redux/actions/adminAction"
import Input from "../../../components/input"

const HomePage = ({ boards, dispatch, loading }) => {
    const history = useHistory()
    const [show, setShow] = useState(false)
    const [name, setName] = useState("")
    const [ isUpdate, setIsUpdate ] = useState(0) /* add - 0 update - 1 */
    const [ updateIndexItem, setUpdateIndexItem ] = useState()

    const _showModal= () => {
        setShow(true)
    }

    const _hideModal = () => {
        setShow(false)
        setName("")
        setIsUpdate(0)
    }

    const _handleSubmit = () => {
        /* validate */
        if (name === "" ) return

        const data = {
            name
        }

        _hideModal()

        if(isUpdate) {
            /* Update */
            const boardSlug = boards[updateIndexItem].slug
            dispatch(updateBoard({ boardSlug, ...data }))
        } else {
            /* Add */
            dispatch(addBoard(data))
        }
    }

    const _updateBoard = (i) => {
        _showModal()
        setIsUpdate(1)  
        setUpdateIndexItem(i)
        const { name } = boards[i]
        setName(name)
    }

    const _deleteBoard = (idx) => {
        const deleteConfirm = window.confirm("Are you sure you want to delete?")
        if(!deleteConfirm) return
        const {slug} = boards[idx]
        dispatch(deleteBoard(slug))
    }

    return (
        <div className="container py-4">
            <div className="border-bottom mb-4">
                <h4>Board</h4>
            </div>
            <div className="slabs">
                {/* <div className="mb-4">
                    <h5>The Living World</h5>
                </div> */}
                <table className="slabs-table table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Board Name</th>
                            <th scope="col">classes</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading 
                        ? (
                            <tr className="position-relative">
                                <td colSpan="5" className="position-absolute top-50 start-50 translate-middle">
                                    <div className="spinner-grow text-success " role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        )
                        : boards?.map((board, idx) => (
                            <tr key={idx}>
                                <th scope="row">{idx + 1}</th>
                                <td className="slab-title col-7" onClick={() => history.push(`/admin/${board.slug}`, {board: board.slug})}>{board.name}</td>
                                <td>{board.classes.length}</td>
                                <td className="action-icons col-2">
                                    <i className="bi bi-pencil-square text-success" onClick={() => _updateBoard(idx)}> Edit</i>
                                    <i className="bi bi-trash-fill text-danger" onClick={() => _deleteBoard(idx)}/>
                                </td>
                            </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className="float-end add-button">
                    <button type="button" className="btn btn-primary" onClick={_showModal}>Add Board</button>
                </div>
                
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
                            Add Class
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        {/* <div className="form-floating mb-3">
                            <input 
                                type="text" 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="form-control" 
                                id="floatingInput" 
                                placeholder="eg. CBSE"/>
                            <label htmlFor="floatingInput">Board Name</label>
                        </div> */}
                        <Input
                            type="text" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="form-control" 
                            id="board-name" 
                            placeholder="eg. CBSE"
                            label="Board Name"
                        />
                    </form>
                </Modal.Body>
                <Modal.Footer>
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
                    <Button onClick={_hideModal} variant="secondary">Close</Button>
                </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        boards: state.data.boards,
        loading: state.data.loading
    }
}

export default connect(mapStateToProps)(HomePage)
