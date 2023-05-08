import { connect } from "react-redux"
import { useState, useEffect } from 'react'
import { Modal, Button } from "react-bootstrap"
import { addStream, addSubject, deleteStream, deleteSubject, updateStream, updateSubject } from "../../../redux/actions/adminAction"
import { getClass, getStreams } from "../../../redux/actions/dataAction"
import { useRouteMatch, useHistory, withRouter } from "react-router-dom"
import Input from '../../../components/input'

const ClassPage = ({ classData, streamData, loading, dispatch }) => {
    const history = useHistory()
    const match = useRouteMatch()
    const [show, setShow] = useState(false)
    const [addStreamshow, setStreamShow] = useState(false)
    const [name, setName] = useState("")
    const [ isUpdate, setIsUpdate ] = useState(0) /* add - 0 update - 1 */
    const [ updateIndexItem, setUpdateIndexItem ] = useState()

    
    const [streamName, setStreamName] = useState("")
    const [selectedSubjects, setSelectedSubjects] = useState(new Set())
    // const [selectedSubjects, setSelectedSubjects] = useState([])

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
            name,
            classId: classData._id,
            classSlug: match.params.class
        }
        _hideModal()

        if(isUpdate) {
            /* Update */
            const subjectSlug = classData?.subjects[updateIndexItem].slug
            dispatch(updateSubject({ subjectSlug, ...data }))
        } else {
            /* Add */
            dispatch(addSubject(data))
        }
    }

    const _updateSubject = (i) => {
        _showModal()
        setIsUpdate(1)  
        setUpdateIndexItem(i)
        const { name } = classData?.subjects[i]
        setName(name)
    }

    const _deleteSubject = (idx) => {
        const deleteConfirm = window.confirm("Are you sure you want to delete?")
        if(!deleteConfirm) return
        const {slug} = classData?.subjects[idx]
        dispatch(deleteSubject({ classSlug: match.params.class, 
                subjectSlug: slug }))
    }

    const _onAddSubjects = (id) => {
        if(selectedSubjects.has(id)) {
            selectedSubjects.delete(id)
        } else {
            selectedSubjects.add(id)
        }
        console.log(selectedSubjects)
    }

    const _hideAddStreamModal = () => {
        setStreamShow(false)
        setSelectedSubjects(new Set())
        setStreamName('')
        setIsUpdate(0)

    }

    const _handleSubmitStream = () => {

        const subjectList = Array.from(selectedSubjects)

        if(!streamName || !subjectList) return

        
        if(isUpdate) {
            const {slug, active}= streamData[updateIndexItem]
            
            dispatch(updateStream({ 
                streamSlug: slug, 
                name: streamName, 
                subjects: Array.from(selectedSubjects),
                active,
                classSlug: match.params.class
            }))
        } else {
            const body = {
                name: streamName,
                board: classData.board,
                classId: classData._id,
                subjects: subjectList
            }
            dispatch(addStream(body))
            
        }
        _hideAddStreamModal()
    }

    const _updateStream = (idx) => {
        setStreamShow(true)
        setIsUpdate(1)
        setUpdateIndexItem(idx)

        const stream = streamData[idx]
        const selectedSubjectIds = streamData[idx]?.subjects.map((s) => s._id)
        setStreamName(stream.name)
        setSelectedSubjects(new Set(selectedSubjectIds))
    }

    const _deleteStream = (idx) => {
        const data = {
            streamSlug: streamData[idx].slug,
            classSlug: match.params.class
        }
        console.log(data)
        dispatch(deleteStream(data))
    }

    const _changeActiveState = (i) => {
        const {name, subjects, active, slug} = streamData[i]
        
        dispatch(updateStream({ 
            name, 
            subjects: subjects.map((s) => s._id),
            active: !active, //change active state,
            classSlug: match.params.class,
            streamSlug: slug, 
            
        }))
    }

    useEffect(() => {
        /* get subjects for the classId */
        dispatch(getClass(match.params.class))
        dispatch(getStreams(match.params.class))
    }, [match.params.class, dispatch])

    return (
        <div className="container py-4">
            <div className="border-bottom mb-4">
                <h4>{!loading && classData?.name}</h4>
            </div>
            <div className="slabs">
                {/* <div className="mb-4">
                    <h5>CBSE</h5>
                </div> */}
                <table className="slabs-table table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Subject</th>
                            <th scope="col">Chapters</th>
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
                        : classData?.subjects && classData?.subjects.map((subject, idx) => (
                            <tr key={subject.slug}>
                                <th scope="row">{idx+1}</th>
                                <td className="slab-title col-7" onClick={() => history.push(`${match.url}/${subject.slug}`)}>{subject.name}</td>
                                <td>{subject.chapters.length}</td>
                                <td className="action-icons col-2">
                                    <i className="bi bi-pencil-square text-success" onClick={() => _updateSubject(idx)}> Edit</i>
                                    <i className="bi bi-trash-fill text-danger" onClick={() => _deleteSubject(idx)}/>
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
                        Add Subject
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
                            Add Subject
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
                                placeholder="eg. Zoology"
                            />
                            <label htmlFor="floatingInput">Subject Name</label>
                        </div> */}
                        <Input
                            type="text" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="form-control" 
                            id="sub-name" 
                            placeholder="eg. Zoology"   
                            label="Subject Name"
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

            <div className="my-5">
                <div className="border-bottom mb-4">
                    <h4>{!loading && 'Streams'}</h4>
                </div>
                <div className="slabs">
                    {/* <div className="mb-4">
                        <h5>CBSE</h5>
                    </div> */}
                    <table className="slabs-table table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Stream</th>
                                <th scope="col">Subjects</th>
                                <th scope="col">Active</th>
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
                            : streamData && streamData?.map((stream, idx) => (
                                <tr key={stream.slug}>
                                    <th scope="row">{idx+1}</th>
                                    <td className="slab-title col-7" /* onClick={() => history.push(`${match.url}/${stream.slug}`)} */>{stream.name}</td>
                                    <td>{stream?.subjects?.length}</td>
                                    <td>
                                        <div className="form-check form-switch ms-2">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="flexSwitchCheckChecked" 
                                                defaultChecked={stream.active}
                                                onChange={() => _changeActiveState(idx)}
                                            />
                                        </div>
                                    </td>
                                    <td className="action-icons col-2">
                                        <i className="bi bi-pencil-square text-success" onClick={() => _updateStream(idx)}> Edit</i>
                                        <i className="bi bi-trash-fill text-danger" onClick={() => _deleteStream(idx)}/>
                                    </td>
                                </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className="float-end add-button">
                        <button type="button" 
                                className="btn btn-primary" 
                                onClick={() => setStreamShow(true)}
                            >
                            Add Stream
                        </button>
                    </div>


                    <Modal  
                        size="lg"
                        show={addStreamshow}
                        backdrop="static"
                        animation={false}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                                Add Stream
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <Input
                                type="text" 
                                value={streamName}
                                onChange={e => setStreamName(e.target.value)}
                                className="form-control" 
                                id="stream-name" 
                                placeholder="eg. Computer Science"   
                                label="Stream Name"
                            />
                            
                            
                            <label htmlFor="subjects">Select Subjects</label>
                            <div className="subjects-added mt-3" id="subjects">

                                <div className="list-group" onChange={(e) => _onAddSubjects(e.target.value)}>
                                    {classData?.subjects && classData?.subjects.map((subject) => (
                                        // <tr key={subject.slug}>
                                        //     <th scope="row">{idx+1}</th>
                                        //     <td className="slab-title col-7" onClick={() => history.push(`${match.url}/${subject.slug}`)}>{subject.name}</td>
                                        //     <td>{subject.chapters.length}</td>
                                        //     <td className="action-icons col-2">
                                        //         <i className="bi bi-pencil-square text-success" onClick={() => _updateSubject(idx)}> Edit</i>
                                        //         <i className="bi bi-trash-fill text-danger" onClick={() => _deleteSubject(idx)}/>
                                        //     </td>
                                        // </tr>
                                        <label className="list-group-item" key={subject.slug}>
                                            <input className="form-check-input me-1" defaultChecked={selectedSubjects.has(subject._id)} type="checkbox" value={subject._id}/>
                                            {subject.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {/* <div className="float-end mt-2">
                                <Button onClick={_handleSubmit}>
                                    Add Subject
                                </Button>
                            </div> */}
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={_handleSubmitStream}>
                            {loading
                                ? (
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                )
                                : isUpdate ? "Update" : "Add"
                            }
                        </Button>
                        <Button onClick={_hideAddStreamModal} variant="secondary">Close</Button>
                    </Modal.Footer>
                    </Modal>

                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return { 
        classData: state.data.class,
        streamData: state.data.streams,
        loading: state.data.loading
     }
}

export default withRouter(connect(mapStateToProps)(ClassPage))
