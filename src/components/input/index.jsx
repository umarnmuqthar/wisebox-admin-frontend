import './styles.scss'
import PropTypes from 'prop-types'

const Input = ({ label, id, placeholder, textarea, ...props}) => {
    return (
        <div className="form-floating mb-3">
            {textarea
            ?   <textarea
                    className="form-control" 
                    id={id || "floatingInput"}
                    placeholder={placeholder || label}
                    {...props}
                />
            :   <input 
                    className="form-control" 
                    id={id || "floatingInput"}
                    placeholder={placeholder || label}
                    {...props}
                />
            }
            <label htmlFor={id || "floatingInput"}>{label}</label>
        </div>
    )
}

export default Input

Input.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string,
    textarea: PropTypes.bool,
    placeholder: PropTypes.string,
}