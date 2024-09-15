import courses from "../data/courses.json"
import React, { useState, useEffect } from "react"
import { Tooltip } from 'react-tooltip'
import { FaArrowLeft, FaArrowRight, FaBook } from "react-icons/fa";
import { SlNotebook } from "react-icons/sl";
import { HiMiniXMark } from "react-icons/hi2";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { IoCart } from "react-icons/io5";

type Props = {
    filteredCourses: string[],
    cartNames: string[],
    addToCart: (arg0: string) => void,
    removeFromCart: (arg0: string) => void,
    setAutoSearch: (arg0: string) => void
}


export default function Search({ filteredCourses, cartNames, addToCart, removeFromCart, setAutoSearch }: Props) {
    useEffect(() => {
        setSelected(0)
    }, [filteredCourses])

    const [selected, setSelected] = useState(0);
    const [recommended, setRecommended] = useState([])

    // Note: I can't seem to access the API (it just returns index.html??)
    // function getCourseInfo(term: string) {
    //     fetch('/api/base/2022A/courses/CIS-120/')
    //     .then(res => res.json())
    //     .then(console.log);
    // }

    useEffect(() => {
        if (selected != null) {
            recommend(selected)
        } else if (filteredCourses.length === 1) {
            recommend(0)
        }
    }, [selected, filteredCourses])

    function recommend(selected: number) {
        let course = filteredCourses[selected];
        let prereqs = course?.prereqs;

        let toRecommend = []
        if (prereqs)
            for (let p of prereqs) {
                console.log(p)
                var result = courses.find(obj => {
                    return (obj.dept + obj.number) === p.replace(" ", "");
                })
                if (result)
                    toRecommend.push(result)
            }
        console.log(toRecommend)
        if (toRecommend.length > 0)
            setRecommended(toRecommend)
        else {
            const shuffled = courses.sort(() => 0.5 - Math.random());
            let randomCourses = shuffled.slice(0, 2);
            setRecommended(toRecommend.concat(randomCourses))

        }
    }



    return (
        <div style={{ gridColumn: '1 / 4', display: 'grid', gridTemplateRows: "repeat(5, 1fr)", gap: "30px" }}>

            {/* Won't show search grid if there's only one matching course. */}
            {filteredCourses.length === 1
                ? <div className="search-container container-shadow">
                    <div className="search-info-container">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <p className="search-title">{filteredCourses[0]?.dept} {filteredCourses[0]?.number}</p>
                            {!cartNames.includes(filteredCourses[0]?.fullName)
                                ? cartNames.length < 7
                                    ? <button onClick={() => addToCart(filteredCourses[0]?.fullName)}>Add to Cart</button>
                                    : <>
                                        <button data-tooltip-id="no-room"
                                            data-tooltip-content="You can only have 7 courses in your cart!"
                                            data-tooltip-place="top"
                                            className="disabled-button">Add to Cart</button>
                                        <Tooltip id="no-room" style={{ zIndex: 10000 }} />
                                    </>
                                : <button style={{ backgroundColor: "#ea3b52" }} onClick={() => removeFromCart(filteredCourses[0]?.fullName)}>Remove from Cart</button>
                            }
                        </div>
                        <p className="search-subtitle">{filteredCourses[0]?.title}</p>
                        {filteredCourses[0]?.["cross-listed"]
                            ? <p style={{ marginBottom: "10px", fontStyle: "italic" }}>{filteredCourses[0]["cross-listed"].join(", ")}</p>
                            : <p style={{ marginBottom: "10px" }}></p>
                        }
                        <p className="search-description">{filteredCourses[0]?.description}</p>

                        <div style={{ paddingTop: "40px", display: "flex", gap: 80, alignItems: "flex-start" }}>
                            <div style={{ display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center", gap: "10px", width: "80px" }}>
                                <p className="search-description" style={{ fontWeight: "bold" }}>Quality</p>
                                <CircularProgressbar minValue={1} value={filteredCourses[0]["quality"]} maxValue={4} text={filteredCourses[0]["quality"]} strokeWidth={15} styles={buildStyles({
                                    textSize: 25,
                                    textColor: "#30B897",
                                    pathColor: "#30B897",
                                    trailColor: '#C5E9E0',
                                })} />
                            </div>
                            <div style={{ display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center", gap: "10px", width: "80px" }}>
                                <p className="search-description" style={{ fontWeight: "bold" }}>Difficulty</p>
                                <CircularProgressbar minValue={1} value={filteredCourses[0]["difficulty"]} maxValue={4} text={filteredCourses[0]["difficulty"]} strokeWidth={15} styles={buildStyles({
                                    textSize: 25,
                                    textColor: "#30B897",
                                    pathColor: "#30B897",
                                    trailColor: '#C5E9E0',
                                })} />
                            </div>
                            {filteredCourses[0]["prereqs"] != undefined
                                ? <div>
                                    <p className="search-description" style={{ fontWeight: "bold" }}>Prerequisites</p>
                                    {filteredCourses[0]["prereqs"].map(course => <li className="search-description">{course}</li>)}
                                </div>
                                : null
                            }
                        </div>

                        <div className="feedback-good">
                            <p className="search-description" style={{ marginBottom: "1em" }}>Related courses:</p>
                            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                                {recommended.map((
                                    {
                                        dept,
                                        number,
                                        title,
                                    },
                                    index
                                ) => (
                                    <div className='class-card-search' onClick={() => setAutoSearch(dept + number)}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <p className='class-title'>{dept} {number} </p>
                                            {cartNames.includes(dept + number) ? <IoCart color="#30B897" size={20} /> : null}
                                        </div>
                                        <p className='class-subtitle'>{title}</p>
                                    </div>
                                )
                                )}
                            </div>
                        </div>

                    </div>
                </div>
                : <div className="search-container container-shadow">
                    <div className="search-results-container">
                        {filteredCourses.map((
                            {
                                dept,
                                number,
                                title,
                                description,
                                prereqs,
                                fullName,
                                "cross-listed": crossListed,
                            },
                            index
                        ) => (
                            <div className={selected == index ? "search-result-entry-selected" : "search-result-entry"} onClick={() => setSelected(index)}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <p className='class-title'>{dept} {number} </p>
                                    {cartNames.includes(dept + number) ? <IoCart color="#30B897" size={20} /> : null}
                                </div>
                                <p className="search-result-subtitle">{title}</p>
                            </div>
                        )
                        )}
                    </div>
                    {filteredCourses.length
                        ? <>
                            {Number.isInteger(selected)
                                ?
                                <div className="search-info-container">
                                    <div className="arrow-controls">
                                        <FaArrowLeft className={(selected - 1 >= 0) && "arrowBtn"} size={25} color={(selected - 1 >= 0) ? "#30B897" : "black"} onClick={() => { if (selected - 1 >= 0) setSelected(selected - 1) }} />
                                        <p style={{ fontSize: 20, fontWeight: "bold" }}>{selected + 1}</p>
                                        <FaArrowRight className={(selected + 1 < filteredCourses.length) && "arrowBtn"} size={25} color={(selected + 1 < filteredCourses.length) ? "#30B897" : "black"} onClick={() => { if (selected + 1 < filteredCourses.length) setSelected(selected + 1) }} />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <p className="search-title">{filteredCourses[selected]?.dept} {filteredCourses[selected]?.number}</p>
                                        {!cartNames.includes(filteredCourses[selected]?.fullName)
                                            ? cartNames.length < 7
                                                ? <button onClick={() => addToCart(filteredCourses[selected]?.fullName)}>Add to Cart</button>
                                                : <>
                                                    <button data-tooltip-id="no-room"
                                                        data-tooltip-content="You can only have 7 courses in your cart!"
                                                        data-tooltip-place="top"
                                                        className="disabled-button">Add to Cart</button>
                                                    <Tooltip id="no-room" style={{ zIndex: 10000 }} />
                                                </>
                                            : <button style={{ backgroundColor: "#ea3b52" }} onClick={() => removeFromCart(filteredCourses[selected]?.fullName)}>Remove from Cart</button>
                                        }
                                    </div>
                                    <p className="search-subtitle">{filteredCourses[selected]?.title}</p>
                                    {filteredCourses[selected]?.["cross-listed"]
                                        ? <p style={{ marginBottom: "10px", fontStyle: "italic" }}>{filteredCourses[selected]["cross-listed"].join(", ")}</p>
                                        : <p style={{ marginBottom: "10px" }}></p>
                                    }
                                    <p className="search-description">{filteredCourses[selected]?.description}</p>

                                    <div style={{ paddingTop: "40px", display: "flex", gap: 80, alignItems: "flex-start" }}>
                                        <div style={{ display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center", gap: "10px", width: "80px" }}>
                                            <p className="search-description" style={{ fontWeight: "bold" }}>Quality</p>
                                            <CircularProgressbar minValue={1} value={filteredCourses[selected]["quality"]} maxValue={4} text={filteredCourses[selected]["quality"]} strokeWidth={15} styles={buildStyles({
                                                textSize: 25,
                                                textColor: "#30B897",
                                                pathColor: "#30B897",
                                                trailColor: '#C5E9E0',
                                            })} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center", gap: "10px", width: "80px" }}>
                                            <p className="search-description" style={{ fontWeight: "bold" }}>Difficulty</p>
                                            <CircularProgressbar minValue={1} value={filteredCourses[selected]["difficulty"]} maxValue={4} text={filteredCourses[selected]["difficulty"]} strokeWidth={15} styles={buildStyles({
                                                textSize: 25,
                                                textColor: "#30B897",
                                                pathColor: "#30B897",
                                                trailColor: '#C5E9E0',
                                            })} />
                                        </div>
                                        {filteredCourses[selected]["prereqs"] != undefined
                                            ? <div>
                                                <p className="search-description" style={{ fontWeight: "bold" }}>Prerequisites</p>
                                                {filteredCourses[selected]["prereqs"].map(course => <li className="search-description">{course}</li>)}
                                            </div>
                                            : null
                                        }
                                    </div>

                                    <div className="feedback-good">
                                        <p className="search-description" style={{ marginBottom: "1em" }}>Related courses:</p>
                                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                                            {recommended.map((
                                                {
                                                    dept,
                                                    number,
                                                    title,
                                                },
                                                index
                                            ) => (
                                                <div className='class-card-search' onClick={() => setAutoSearch(dept + number)}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                        <p className='class-title'>{dept} {number} </p>
                                                        {cartNames.includes(dept + number) ? <IoCart color="#30B897" size={20} /> : null}
                                                    </div>
                                                    <p className='class-subtitle'>{title}</p>
                                                </div>
                                            )
                                            )}
                                        </div>
                                    </div>


                                </div>
                                : <div className="search-no-results-container">
                                    <SlNotebook color="rgb(96, 96, 96)" size={50} />
                                    <p className="no-result-text">Select a course from the left!</p>
                                    <p style={{ opacity: 0 }}>There's this really weird css thing that I don't have time to fix right now but I just need to write a lot of words and it'll work I promise. Look, it's a lot of words but the message is clear. I need a lot of words. Trust me on this one. CSS is crazy man. I think we're about done.</p>

                                </div>
                            }
                        </>
                        : <div className="search-no-results-container">
                            <HiMiniXMark color="rgb(96, 96, 96)" size={50} />
                            <p className="no-result-text">No results found. Try a different search term.</p>
                        </div>
                    }

                </div>
            }

        </div >
    )
}