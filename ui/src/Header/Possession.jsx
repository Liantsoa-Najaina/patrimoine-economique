// eslint-disable-next-line no-unused-vars
import React from 'react';
import ListPossession from '../Pages/ListPossession';
import Button from '../Components/Button';

export default function Possession() {
    return (
        <div className="container">

            <div className="d-flex justify-content-end mb-4" style={{ marginTop: '20px', marginRight: '30px' }}>
                <Button print={"Menu"} target={"/"} />
            </div>

            <div className="mb-4">
                <ListPossession />
            </div>

            <div className="d-flex justify-content-center mt-4">
                <Button print={"Create Possession"} target={"create"} />
            </div>
        </div>
    );
}
