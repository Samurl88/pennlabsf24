import Nav from "../components/Nav"
import Courses from "../components/Courses"
import Cart from "../components/Cart"
import Landing from "../components/Landing"
import Search from "../components/Search"

import courseData from "../data/courses.json"
import { IoCartOutline } from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";

import { useNavigate } from "react-router-dom"
import { IoCart } from "react-icons/io5";




import "/home.css"
import 'react-tooltip/dist/react-tooltip.css'


import React, { useEffect, useState } from 'react'


function App() {
	const navigate = useNavigate();

	const [courses, setCourses] = useState(null);
	const [filteredCourses, setFilteredCourses] = useState([]);
	const [term, setTerm] = useState(null);
	const [cart, setCart] = useState([]);
	const [cartNames, setCartNames] = useState([])
	const [autoSearch, setAutoSearch] = useState(null)

	// Adds course to cart and updates local storage
	const addToCart = (fullName: string) => {
		setCartNames([...cartNames, fullName])
		updateCart([...cartNames, fullName])
		localStorage.setItem("cart", JSON.stringify([...cartNames, fullName]))
	}

	const removeFromCart = (fullName: string) => {
		let index = cartNames.indexOf(fullName);
		let tempCartNames = cartNames
		if (index !== -1)
			tempCartNames.splice(index, 1);
		updateCart(tempCartNames)
		localStorage.setItem("cart", JSON.stringify(tempCartNames))
		setCartNames(tempCartNames)

	}

	const updateCart = (currentList: string[]) => {
		let coursesInCart = []
		for (let course of currentList) {
			var result = courseData.find(obj => {
				return (obj.dept + obj.number) === course;
			})
			coursesInCart.push(result);
		}
		setCart(coursesInCart)
	}

	const createLink = () => {
		let link = '/receipt?'
		
		for (const [index, name] of cartNames.entries()) {
			link += `c${index}=${name}&`
		}
		navigate(link)
	}

	useEffect(() => {
		// localStorage.setItem("cart", JSON.stringify(["CIS160", "CIS120"]))

		// Add combined name (dept + course to courses )
		let formattedCourses = [];
		for (let course of courseData) {
			course["fullName"] = course["dept"] + course["number"];
			formattedCourses.push(course);
		}
		setCourses(formattedCourses);

		// Populate cart with LocalStorage
		let localCart = JSON.parse(localStorage.getItem("cart")) || [];
		setCartNames(localCart)
		updateCart(localCart)
	}, [])

	const handleSearch = (term: string) => {
		setTerm(term)
		let strippedTerm = term.replace(/\s/g, '').toLowerCase();
		let filteredCourses = [];

		// Filter courses based on search term. Matches course name and description 
		for (let course of courses) {
			if (course.fullName.replace(/\s/g, '').toLowerCase() === strippedTerm) {
				filteredCourses = [course];
				break
			}else if (course.fullName.replace(/\s/g, '').toLowerCase().includes(strippedTerm) || course.title.replace(/\s/g, '').toLowerCase().includes(strippedTerm) || course.description.replace(/\s/g, '').toLowerCase().includes(strippedTerm)) {
				filteredCourses.push(course);
			}
		}
		setFilteredCourses(filteredCourses);
	}

	return (
		<>
			<Nav handleSearch={handleSearch} autoSearch={autoSearch} />
			{/* <Courses /> */}
			<div
				style={{
					margin: 0,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minWidth: "320px",
					minHeight: "90vh",
					width: "100vw",
				}}>
				<div style={{ padding: "20px" }}>
					<div className="overall-grid">
						<div className="subtitle" style={{ gridRow: 1, margin: 0, paddingLeft: 5, fontWeight: "bold", }}>
							{term ? filteredCourses.length === 1 ? `Search (1 result)` : `Search (${filteredCourses.length} results)` : "Home"}
						</div>
						{term ? <Search filteredCourses={filteredCourses} cartNames={cartNames} addToCart={addToCart} removeFromCart={removeFromCart} setAutoSearch={setAutoSearch} /> : <Landing setAutoSearch={setAutoSearch} cartNames={cartNames} />}

						<div className="subtitle" style={{ gridRow: 1, gridColumn: 4, margin: 0, paddingLeft: 5, fontWeight: "bold" }}>Your Cart ({cart.length}/7)</div>
						<div style={{ gridColumn: '4' }}>
							<div className="cart-container container-shadow">
								{cart.length
									? <div className="course-cart-container">
										{
											cart.map((
												{
													dept,
													number,
													title,
												},
												index
											) => (
												<div className='cart-card' onClick={() => { if (cartNames.includes(dept + number)) setAutoSearch(dept + " " + number) }}>
													<div style={{ flex: 1 }}>
														<p className='class-title'>{dept} {number}</p>
														<p className='class-subtitle'>{title}</p>
													</div>
													<div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }} onClick={() => { removeFromCart(dept + number) }}>
														<HiMiniXMark size={30} className="xmark" color="#505050" />
													</div>
												</div>
											)
											)}

									</div>
									: <div className="empty-course-cart-container">
										<IoCartOutline color="rgb(96, 96, 96)" size={50} />
										<p className="no-result-text">Your cart is currently empty.</p>
									</div>

								}
								<button onClick={createLink} className={cart.length ? "" : "disabled-button"} style={{ position: 'absolute', bottom: "1.5rem", left: 0, right: 0, marginRight: "auto", marginLeft: "auto", width: "90%" }}>
									Checkout
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default App
