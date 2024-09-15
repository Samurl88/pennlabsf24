import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Receipt from "./pages/Receipt"
import Nav from './components/Nav';

type Props = {}

export default function App(props: Props) {
  return (
    <>			
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/receipt" element={<Receipt />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}