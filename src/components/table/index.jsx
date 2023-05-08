import PropTypes from 'prop-types';
import { useHistory, useRouteMatch } from 'react-router-dom';

const Table = ({loading, rows, _updateSlab, _deleteSlab, _changeActiveState}) => {
    const history = useHistory()
    const match = useRouteMatch()
    
    return (
        <div>
            <table className="slabs-table table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">Questions</th>
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
                        : rows?.length
                            ? rows.map((row, idx) => (
                                <tr key={row.slug}>
                                    <th scope="row">{row?.idx}</th>
                                    <td className="slab-title col-7" onClick={() => history.push(`${match.url}/${row.slug}`)}>{row.title}</td>
                                    <td>{row.questions.length}</td>
                                    <td>
                                        <div className="form-check form-switch ms-2">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="flexSwitchCheckChecked" 
                                                defaultChecked={row.active}
                                                onChange={() => _changeActiveState(idx)}
                                            />
                                        </div>
                                    </td>
                                    <td className="action-icons col-2">
                                        {/* <i className="bi bi-clipboard-data text-primary">
                                            {" "}Slab Points
                                        </i>
                                        <br/> */}
                                        <i className="bi bi-pencil-square text-success me-2" onClick={() => _updateSlab(idx)}> Edit</i>
                                        {/* <br/> */}
                                        <i className="bi bi-trash-fill text-danger" onClick={() => _deleteSlab(idx)}> Delete</i>
                                    </td>
                                </tr>
                            ))
                            : (
                                <tr className="text-primary">
                                    <td colSpan="5" className="text-center">
                                        <h6>No Slabs</h6>
                                    </td>
                                </tr>
                            )
                        }
                </tbody>
            </table>
        </div>
    )
}

export default Table

Table.propTypes = {
    loading: PropTypes.bool,
    rows: PropTypes.arrayOf(PropTypes.object),
    _updateSlab: PropTypes.func,
    _deleteSlab: PropTypes.func,
}