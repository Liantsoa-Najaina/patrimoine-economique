// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({ print, target }) {
    return (
        <button className='py-2 px-4 mx-4'>
            <Link
                className='bg-blue-600 py-2 px-4 rounded text-white text-decoration-none'
                to={target}
                style={{ textDecoration: 'none' }}
            >
                {print}
            </Link>
        </button>
    );
}
