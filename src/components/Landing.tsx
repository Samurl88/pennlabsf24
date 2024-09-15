import React, { useEffect, useState } from 'react'
import '/home.css'

import courses from "../data/courses.json"
import Modal from 'react-modal';
import { Wheel } from 'react-custom-roulette'
import { IoCart } from 'react-icons/io5';


type Props = {
    setAutoSearch: (arg0: string) => void,
    cartNames: string[]
}

export default function Home({ setAutoSearch, cartNames }: Props) {
    const [randomCourses, setRandomCourses] = useState([])
    const [onSpin, setOnSpin] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [spinCourses, setSpinCourses] = useState([{ option: '0', style: { backgroundColor: 'green', textColor: 'black' } }])
    const [spinDone, setSpinDone] = useState(false)


    useEffect(() => {
        // From: https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
        setRandomCourses(getRandomCourses)

        prepareSpinner()
    }, [])


    function prepareSpinner() {
        let sCourses = getRandomCourses()
        let data = sCourses.map((
            {
                dept,
                number,
                title,
                description,
                prereqs,
                "cross-listed": crossListed,
            },
            index
        ) => ({ option: dept + " " + number, style: { backgroundColor: index % 2 == 0 ? "#D4FDF3" : "#30B897", textColor: 'black' } })
        )
        setSpinCourses(data)

    }

    function getRandomCourses() {
        const shuffled = courses.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, 6);
        return (selected)
    }

    // const data = [
    //     { option: '0', style: { backgroundColor: 'green', textColor: 'black' } },
    //     { option: '1', style: { backgroundColor: 'white' } },
    //     { option: '2' },
    //   ]

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    return (
        <>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Spin Modal"
            >
                <div style={{padding: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", }}>
                <p className='title' style={{textAlign: "center"}}>Incredibly Insightful Class Picker™</p>
                <p className='subtitle' style={{textAlign: "center"}}>Unsure of which class to take? Our patent pending state-of-the-art technology may or may not help!</p>
                <Wheel
                    mustStartSpinning={onSpin}
                    prizeNumber={0}
                    data={spinCourses}
                    backgroundColors={['#3e3e3e', '#df3428']}
                    textColors={['#ffffff']}

                    onStopSpinning={() => {
                        setOnSpin(false);
                        setSpinDone(true)
                    }}
                />
                {   
                    !spinDone 
                        ? <button style={{marginTop: "1em"}} className={onSpin ? "disabled-button" : ""} onClick={() => setOnSpin(true)}>SPIN!!</button>
                        : <button style={{marginTop: "1em"}} onClick={() => setAutoSearch(spinCourses[0]["option"])}>Go to your new favorite class!</button>

                }


                </div>
            </Modal>
{/* ADD? height: 80vh */}
            <div style={{ gridColumn: '1 / 4', display: 'grid', gridTemplateRows: "repeat(5, 1fr)", gap: "30px",}}>
                <div className="welcome-container container-shadow">
                    <p className="title">Welcome to Penn Course Cart!</p>
                    <p className="subtitle">Enter in the search bar above to find your favorite CIS courses. Here's some to get you started!</p>
                    <div className='class-card-container'>
                        {randomCourses.map((
                            {
                                dept,
                                number,
                                title,
                            },
                            index
                        ) => (
                            <div className='class-card' onClick={() => setAutoSearch(dept + number)}>
                                <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                    <p className='class-title'>{dept} {number} </p>
                                    { cartNames.includes(dept + number) ? <IoCart color="#30B897" size={20}/> : null }
                                </div>
                                <p className='class-subtitle'>{title}</p>
                            </div>
                        )
                        )}
                    </div>
                </div>
                <div className="fun-container container-shadow">
                    <p className='title'>Still lost?</p>
                    <button onClick={openModal}>Spin the wheel!!!</button>
                </div>
            </div>
        </>
    )
}