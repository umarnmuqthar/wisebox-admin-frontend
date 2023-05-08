import "./styles.scss"
import { useEffect } from "react"
import { useHistory, useRouteMatch } from "react-router"
import { connect } from "react-redux"
import { getSubject } from "../../../redux/actions/dataAction"
// import Table from "../../../components/table"

const TeacherChaptersPage = ({ chapters, subjectName, dispatch, loading }) => {
    const history = useHistory()
    const match = useRouteMatch()

    useEffect(() => {
        /* get subjects for the classId */
        dispatch(getSubject(match.params.subject))
    }, [match.params.subject, dispatch])

    return (
        <div className="container py-4">
            <div className="chapters-section">
                <div className="border-bottom mb-4">
                    <h4>{!loading && subjectName}</h4>
                </div>
                <div className="chapters">
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
                                    {/* <th scope="col">Actions</th> */}
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
                                        {/* <td className="action-icons col-2">
                                            <i className="bi bi-pencil-square text-success" onClick={() => _updateSlab(idx)}> Edit</i>
                                            <i className="bi bi-trash-fill text-danger" onClick={() => _deleteChapter(idx)}/>
                                        </td> */}
                                    </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {/* <div className="float-end add-button">
                            <button type="button" 
                                    className="btn btn-primary" 
                                    onClick={_showModal}
                                >
                                Add Chapter
                            </button>
                        </div> */}
                    </div>
                    {/* <div className="row row-cols-1 row-cols-lg-1 g-2 g-lg-3">
                        {loading
                            ? (
                                <div className="d-flex justify-content-center">
                                    <div className="spinner-grow text-success " role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )
                            : chapters?.length > 0 
                                ? chapters?.map((chapter, idx) => (
                                    <div className="col" key={idx}>
                                        <div className="px-3 py-2 shadow card-item" onClick={() => history.push(`${match.url}/${chapter.slug}`)}>
                                            <div className="row">
                                                <div className="count col-1">
                                                    <h5>{chapter?.idx}.</h5>
                                                </div>
                                                <div className="col">
                                                    <h5>{chapter.name}</h5>
                                                    <h6>{chapter.slabs.length} Slabs</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    ))
                                : (
                                    <div className="text-primary">
                                        <div className="text-center">
                                            <h5>No Chapters</h5>
                                        </div>
                                    </div>
                                    )
                        }
                    </div> */}
                </div>

                {/* <div className="class-section mt-4">
                    <div className="papers">
                        <div className="border-bottom mb-3">
                            <h5>Previous Papers</h5>
                        </div>
                        <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
                            <div className="col">
                                <div className="px-3 py-2 shadow card-item bg-secondary">
                                    <h5>Zoology</h5>
                                    <h6>11 Chapters</h6>
                                </div>
                            </div>
                            <div className="col">
                                <div className="px-3 py-2 shadow card-item bg-secondary">
                                    <h5>Zoology</h5>
                                    <h6>11 Chapters</h6>
                                </div>
                            </div>
                            <div className="col">
                                <div className="px-3 py-2 shadow card-item bg-secondary">
                                    <h5>Zoology</h5>
                                    <h6>11 Chapters</h6>
                                </div>
                            </div>
                            <div className="col">
                                <div className="px-3 py-2 shadow card-item bg-secondary">
                                    <h5>Zoology</h5>
                                    <h6>11 Chapters</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

const mapStateToProps = (state, props) => {
    // const subject = state.data.subjects?.filter((data) => data.slug === props.match.params?.subject)[0]
    return {
        subjectName: state.data.subject?.name,
        subjectId: state.data.subject?._id,
        classId: state.data.subject?.classId,
        previousQuestions: state.data.subject?.previousQuestions,
        chapters: state.data.subject?.chapters,
        loading: state.data.loading
    }
}

export default connect(mapStateToProps)(TeacherChaptersPage)
