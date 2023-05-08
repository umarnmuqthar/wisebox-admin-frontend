import { useState, useEffect } from "react"
import { Modal, Button } from "react-bootstrap"
import { connect } from "react-redux"
// import { useHistory, useRouteMatch } from "react-router-dom"
import Input from "../../../components/input"
import { addTeacher, deleteTeacher, updateTeacher } from "../../../redux/actions/adminAction"
import { getTeachers } from "../../../redux/actions/dataAction"



const TeachersPage = ({ loading, teachers, dispatch }) => {
    // const history = useHistory()
    // const match = useRouteMatch()
    const [show, setShow] = useState(false)
    const [inputData, setInputData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [ isUpdate, setIsUpdate ] = useState(0) /* add - 0 update - 1 */
    const [ updateIndexItem, setUpdateIndexItem ] = useState()

    const _showModal= () => {
        setShow(true)
    }

    const _hideModal = () => {
        setShow(false)
        setInputData({
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        })
        setIsUpdate(0)
    }

    const _handleSubmit = () => {
        /* validate */
        // if (name === "" ) return
        // const data = {
            //     name,
            //     // classSlug: match.params.class
            // }
            // dispatch(addSubject(data))
        if (inputData.password !== inputData.confirmPassword) return 
            
        // setShow(false)
        
        if(isUpdate) {
            /* Update */
            // const {slug, active} = chapters[updateIndexItem]
            // dispatch(updateChapter({ chapterSlug: slug, active, ...data }))
            // const data = teachers[updateIndexItem]
            dispatch(updateTeacher(inputData))
        } else {
            /* Add */
            dispatch(addTeacher(inputData))
        } 

        _hideModal()
    }

    const _updateTeacher = (i) => {
        _showModal()
        setIsUpdate(1)  
        setUpdateIndexItem(i)
        const {name, email, active} = teachers[i]
        setInputData({ ...inputData, name, email, active})
    }

    const _deleteTeacher = (i) => {
        const deleteConfirm = window.confirm("Are you sure you want to delete?")
        if(!deleteConfirm) return
        const id = teachers[i]._id
        dispatch(deleteTeacher(id))
    }

    const _onchange = (e) => {
        const field = e.target.name
        setInputData({ ...inputData, [field]: e.target.value })
    }

    useEffect(() => {
        /* get subjects for the classId */
        dispatch(getTeachers())
    }, [dispatch])

    return (
        <div className="container py-4">
            <div className="border-bottom mb-4">
                <h4>Teachers</h4>
            </div>
            <div className="slabs">
                {/* <div className="mb-4">
                    <h5>CBSE</h5>
                </div> */}
                <table className="slabs-table table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
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
                        : teachers && teachers.map((teacher, idx) => (
                            <tr key={teacher.email}>
                                <th scope="row">{idx+1}</th>
                                <td className="slab-title col-7" /* onClick={() => history.push(`${match.url}/`)} */>{teacher.name}</td>
                                <td>{teacher.email}</td>
                                <td className="action-icons col-2">
                                    <i className="bi bi-pencil-square text-success" onClick={() => _updateTeacher(idx)}> Edit</i>
                                    <i className="bi bi-trash-fill text-danger" onClick={() => _deleteTeacher(idx)}/>
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
                        Add Teacher
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
                                Add Teacher
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <Input
                                type="text" 
                                value={inputData.name}
                                onChange={_onchange}
                                className="form-control" 
                                id="name" 
                                name="name"
                                label="Name"
                            />
                            <Input
                                type="text" 
                                value={inputData.email}
                                onChange={_onchange}
                                className="form-control" 
                                id="email" 
                                name="email"
                                label="Email"
                                disabled={isUpdate}
                            />
                            <Input
                                type="password" 
                                value={inputData.password}
                                onChange={_onchange}
                                className="form-control" 
                                id="pwd" 
                                name="password"
                                label="Password"
                            />
                            <Input
                                type="password" 
                                value={inputData.confirmPassword}
                                onChange={_onchange}
                                className="form-control" 
                                id="confirm-pwd" 
                                name="confirmPassword"
                                label="Confirm Password"
                            />
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={_handleSubmit}>{isUpdate ? "Update": "Add"}</Button>
                        <Button onClick={_hideModal} variant="secondary">Close</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        teachers: state.data.teachers,
        loading: state.data.loading
    }
}
export default connect(mapStateToProps)(TeachersPage)
