import React from 'react'
import ListPossession from '../Pages/ListPossession'
import Button from '../Components/Button'

export default function Possession() {
  return (
    <div>
        <ListPossession/>
        <Button print={"Create Possession"} target={"create"} />
        <Button print={"Menu"} target={"/"} />
    </div>
  )
}