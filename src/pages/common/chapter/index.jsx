import './styles.scss'
import { connect } from "react-redux"
import { useState, useEffect } from 'react'
// import { Modal, Button } from "react-bootstrap"
import Modal from '../../../components/modal'
import { deleteSlab, getChapter, updateSlab } from "../../../redux/actions/dataAction"
import { useRouteMatch, withRouter } from "react-router-dom"
import { addSlab } from "../../../redux/actions/teacherAction"
import Input from '../../../components/input'
import Table from '../../../components/table'

const TeacherSlabPage = ({ slabs, chapter, chapterName, dispatch, loading }) => {
    // const history = useHistory()
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

    const _handleSubmit = (i) => {
        /* validate */
        if (name === "" || idx === "") return
        const data = {
            idx: +idx,
            title: name,
            chapterId: chapter._id,
            chapterSlug: match.params.chapter
            // subjectId
        }
        _hideModal()

        if(isUpdate) {
            /* Update */
            const {slug} = chapter.slabs[updateIndexItem]
            dispatch(updateSlab({ slabSlug: slug, ...data }))
        } else {
            /* Add */
            dispatch(addSlab(data))
        }
    }

    const _deleteSlab = (idx) => {
        const deleteConfirm = window.confirm("Are you sure you want to delete?")
        if(!deleteConfirm) return
        const {slug} = chapter.slabs[idx]
        dispatch(deleteSlab({ slabSlug: slug, 
                    chapterSlug: match.params.chapter }))
    }
    
    const _updateSlab = (i) => {
        _showModal()
        setIsUpdate(1)  
        setUpdateIndexItem(i)
        const { title, idx } = chapter.slabs[i]
        setIndex(idx)
        setName(title)
    }

    const _changeActiveState = (i) => {
        const {slug, title, idx, active} = chapter.slabs[i]
        
        dispatch(updateSlab({ 
            slabSlug: slug, 
            idx,
            title,
            active: !active, //change active state
            chapterSlug: match.params.chapter,
        }))
    }

    useEffect(() => {
        /* get subjects for the classId */
        dispatch(getChapter(match.params.chapter))
    }, [match.params.chapter, dispatch])
    
    return (
        <div className="container py-4">
            <div className="border-bottom mb-4">
                <h4>{!loading && chapter.name}</h4>
            </div>
            <div className="slabs">
                <div className="mb-2">
                    <h5>Slabs</h5>
                </div>

                <Table
                    loading={loading}
                    rows={chapter.slabs}
                    _updateSlab={_updateSlab}
                    _deleteSlab={_deleteSlab}
                    _changeActiveState={_changeActiveState}
                />

                <div className="float-end add-button">
                    <button type="button" 
                            className="btn btn-primary" 
                            onClick={_showModal}
                        >
                        Add Slab
                    </button>
                </div>
            </div>
            <Modal
                title="Add Slab"
                show={show}
                isUpdate={isUpdate}
                _handleSubmit={_handleSubmit}
                _hideModal={_hideModal}
            >
                <form>
                    <Input
                        type="number" 
                        value={idx}
                        onChange={e => setIndex(e.target.value)}
                        className="form-control" 
                        id="slab-idx" 
                        min={1}
                        label="Slab Index"
                    />
                    <Input
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="form-control" 
                        id="slab-title"
                        label="Slab Title" 
                    />
                </form>
            </Modal>
        </div>
    )
}

const mapStateToProps = (state, props) => {
    // const chapter = state.data.chapters?.chapt.filter((data) => data.slug === props.match.params?.chapter)[0]
    return { 
        chapter: state.data.chapter,
        // slabs: state.data.slabs,
        loading: state.data.loading /* && !state.data.slabs.length */
     }
}

export default withRouter(connect(mapStateToProps)(TeacherSlabPage))
