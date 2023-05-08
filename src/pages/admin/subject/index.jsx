import './styles.scss'
import { connect } from "react-redux"
import { useState, useEffect } from 'react'
// import { Modal, Button } from "react-bootstrap"
import Modal from '../../../components/modal'
import { addChapter, deleteChapter, updateChapter } from "../../../redux/actions/adminAction"
import { getSubject } from "../../../redux/actions/dataAction"
import { useRouteMatch, useHistory, withRouter } from "react-router-dom"
import Input from '../../../components/input'

const SubjectPage = ({ chapters, loading, subjectName, subjectId, previousQuestions, dispatch, ...props }) => {
    const history = useHistory()
    const match = useRouteMatch()
    const [show, setShow] = useState(false)
    const [name, setName] = useState("")
    const [idx, setIndex] = useState(1)
    const [ isUpdate, setIsUpdate ] = useState(0) /* add - 0 update - 1 */
    const [ updateIndexItem, setUpdateIndexItem ] = useState()

    const _showModal= () => {
        setShow(true)
    }

    const _hideModal = () => {
        setShow(false)
        setName("")
        setIndex(1)
        setIsUpdate(0)
    }

    const _handleSubmit = () => {
        /* validate */
        if (name === "") return

        const data = {
            idx,
            name,
            subjectSlug: match.params.subject,
            subjectId
        }

        _hideModal()

        if(isUpdate) {
            /* Update */
            const {slug, active} = chapters[updateIndexItem]
            dispatch(updateChapter({ chapterSlug: slug, active, ...data }))
        } else {
            /* Add */
            dispatch(addChapter(data))
        }        
    }

    const _updateSlab = (i) => {
        _showModal()
        setIsUpdate(1)  
        setUpdateIndexItem(i)
        const { name, idx } = chapters[i]
        setIndex(idx)
        setName(name)
    }

    const _deleteChapter = (idx) => {
        const deleteConfirm = window.confirm("Are you sure you want to delete?")
        if(!deleteConfirm) return
        const {slug} = chapters[idx]
        dispatch(deleteChapter({ chapterSlug: slug, 
                subjectSlug: match.params.subject }))
    }

    const _changeActiveState = (i) => {
        const {slug, name, idx, active} = chapters[i]
        
        dispatch(updateChapter({ 
            chapterSlug: slug, 
            idx,
            name,
            active: !active, //change active state
            subjectSlug: match.params.subject,
        }))
    }

    useEffect(() => {
        /* get subjects for the classId */
        dispatch(getSubject(match.params.subject))
    }, [match.params.subject, dispatch])

    return (
        <div className="container py-4">
            <div className="border-bottom mb-4">
                <h4>{!loading && subjectName}</h4>
            </div>
            <div className="slabs">
                <div className="mb-2">
                    <h5>Chapters</h5>
                </div>
                <table className="slabs-table table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Slabs</th>
                            <th scope="col">Active</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading 
                        ? (
                            <tr className="text-center">
                                <td colSpan="4">
                                    <div className="spinner-grow text-success" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        )
                        : chapters?.map((chapter, idx) => (
                            <tr key={chapter.slug}>
                                <th scope="row">{chapter?.idx}</th>
                                <td className="slab-title col-7" onClick={() => history.push(`${match.url}/${chapter.slug}`)}>{chapter.name}</td>
                                <td>{chapter.slabs?.length}</td>
                                <td>
                                    <div className="form-check form-switch ms-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="flexSwitchCheckChecked" 
                                            defaultChecked={chapter.active}
                                            onChange={(v) => _changeActiveState(idx)}
                                        />
                                    </div>
                                </td>
                                <td className="action-icons col-2">
                                    <i className="bi bi-pencil-square text-success" onClick={() => _updateSlab(idx)}> Edit</i>
                                    <i className="bi bi-trash-fill text-danger" onClick={() => _deleteChapter(idx)}/>
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
                        Add Chapter
                    </button>
                </div>
            </div>
            {/* <div className="slabs prev-section">
                <div className="mb-2">
                    <h5>Previous Papers</h5>
                </div>
                <table className="slabs-table table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Year</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {previousQuestions && previousQuestions.map((data, idx) => (
                            <tr key={data.slug}>
                                <th scope="row">{idx+1}</th>
                                <td className="slab-title col-7" onClick={() => history.push(`${match.url}/${data.slug}`)}>{data.name}</td>
                                <td>3</td>
                                <td className="action-icons col-2">
                                    <i className="bi bi-pencil-square text-success"> Edit</i>
                                    <i className="bi bi-trash-fill text-danger" onClick={() => {}}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="float-end add-button">
                    <button type="button" 
                            className="btn btn-primary" 
                            onClick={_showModal}
                        >
                        Add Paper
                    </button>
                </div>
            </div> */}

            <Modal
                show={show}
                isUpdate={isUpdate}
                title="Add Chapter"
                _hideModal={_hideModal}
                _handleSubmit={_handleSubmit}
            >
                <form>
                    <Input
                        type="text" 
                        value={idx}
                        min={1}
                        onChange={e => setIndex(e.target.value)}
                        className="form-control" 
                        id="chapter-idx" 
                        label="Chapter Index"
                    />
                    <Input
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="form-control" 
                        id="chapter-name" 
                        label="Chapter Name"
                    />
                </form>
            </Modal>

        </div>
    )
}

const mapStateToProps = (state, props) => {

    return { 
        // subjects: state.data.subjects,
        subjectName: state.data.subject?.name,
        subjectId: state.data.subject?._id,
        classId: state.data.subject?.classId,
        previousQuestions: state.data.subject?.previousQuestions,
        chapters: state.data.subject?.chapters,
        loading: state.data.loading
     }
}

export default withRouter(connect(mapStateToProps)(SubjectPage))
