import React from 'react';
import '../css/FormError.scss';

const FormError = (props) => {
    return (
        <div className="error-prompt">
            {props.error}
        </div>
    );
}

export default FormError;