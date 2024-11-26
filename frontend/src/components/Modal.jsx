// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';

export default function Modal({ children, onClose }) {
    return (
        <>
            <div className='backdrop' onClick={onClose}></div>
            <dialog className='modal' open>
                {children}
            </dialog>
        </>
    );
}

Modal.propTypes = {
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
};
