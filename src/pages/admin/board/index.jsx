import { connect } from "react-redux"
import { useState, useEffect  } from 'react'
import { Modal, Button } from "react-bootstrap"
import { addClass, deleteClass, updateClass } from "../../../redux/actions/adminAction"
import { getBoard } from "../../../redux/actions/dataAction"
import { useHistory, withRouter } from "react-router-dom"

const BoardPage = ({ classes, classIndices, loading, match, boardName, boardId, dispatch, ...props }) => {
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
        if (name === "" || name === "Choose the class") return

        const data = {
            name,
            boardId,
            boardSlug: match.params.board
        }

        _hideModal()

        if(isUpdate) {
            /* Update */
            const classSlug = classes[updateIndexItem].slug
            dispatch(updateClass({ classSlug, ...data }))
        } else {
            /* Add */
            dispatch(addClass(data))
        }
    }

    const _updateClass = (i) => {
        _showModal()
        setIsUpdate(1)  
        setUpdateIndexItem(i)
        const { name } = classes[i]
        setName(name)
    }

    const _deleteClass = (idx) => {
        const deleteConfirm = window.confirm("Are you sure you want to delete?")
        if(!deleteConfirm) return
        const {slug} = classes[idx]
        dispatch(deleteClass({slug, boardSlug: match.params.board}))
    }

    useEffect(() => {
        dispatch(getBoard(match.params.board))
    }, [match.params.board, dispatch])

    return (
        <div className="container py-4">
            <div className="border-bottom mb-4">
                <h4>{!loading && boardName}</h4>
            </div>
            <div className="slabs">
                {/* <div className="mb-4">
                    <h5>CBSE</h5>
                </div> */}
                <table className="slabs-table table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Class</th>
                            <th scope="col">Subjects</th>
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
                        : classes?.map((cls, idx) => (
                            <tr key={cls.slug}>
                                <th scope="row">{idx + 1}</th>
                                <td className="slab-title col-7" onClick={() => history.push(`${match.url}/${cls.slug}`)}>{cls.name}</td>
                                <td>{cls.subjects.length}</td>
                                <td className="action-icons col-2">
                                    <i className="bi bi-pencil-square text-success" onClick={() => _updateClass(idx)}> Edit</i>
                                    <i className="bi bi-trash-fill text-danger" onClick={() => _deleteClass(idx)}/>
                                </td>
                            </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className="float-end add-button">
                    <button type="button" 
                            className="btn btn-primary" 
                            onClick={_showModal}
                        >
                        Add Class
                    </button>
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
                        <div className="form-floating">
                            <select className="form-select" defaultValue={name} onChange={(e) => setName(e.target.value)}>
                                <option>Choose the class</option>
                                {[...Array(5)].map((_, i) => (classIndices?.indexOf(i+8) === -1 && 
                                        <option key={i} value={`Class ${i+8}`}>Class {i+8}</option>
                                ))}
                                {isUpdate && 
                                    <option value={classes[updateIndexItem].name}>{classes[updateIndexItem].name}</option>
                                }
                            </select>
                            <label htmlFor="floatingSelectGrid">Class</label>
                        </div>
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

const mapStateToProps = (state, props) => {
    // const board = state.data.boards?.filter((data) => data.slug === props.location.state?.board)[0]
    const board = state.data.board
    return {
        classes: board?.classes,
        classIndices: board?.classes?.map((cls) => cls.idx),
        boardId: board?._id,
        boardName: board?.name,
        loading: state.data.loading
    }
}

export default withRouter(connect(mapStateToProps)(BoardPage))
