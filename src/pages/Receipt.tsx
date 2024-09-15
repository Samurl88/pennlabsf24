import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import courses from "../data/courses.json"

type Props = {}

export default function Receipt({ }: Props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { width, height } = useWindowSize()
    const [confettiRun, setRun] = useState(300)
    const navigate = useNavigate();
    
    const [cart, setCart] = useState([])

    // Get all the classes from parameters
    const c0 = searchParams.get('c0')
    const c1 = searchParams.get('c1')
    const c2 = searchParams.get('c2')
    const c3 = searchParams.get('c3')
    const c4 = searchParams.get('c4')
    const c5 = searchParams.get('c5')
    const c6 = searchParams.get('c6')

    const cartNames = [c0, c1, c2, c3, c4, c5, c6]

    useEffect(() => {
        let coursesInCart = []
        if (cartNames.length) {
            for (let course of cartNames) {
                var result = courses.find(obj => {
                    return (obj.dept + obj.number) === course;
                })
                if (result)
                    coursesInCart.push(result);
            }
            setCart(coursesInCart)
        }
    }, [])


    useEffect(() => {
        setTimeout(() => {
            setRun(0)
        }, 2000)
    }, [confettiRun])

    return (
        <>
            <Confetti
                width={width}
                height={height}
                numberOfPieces={confettiRun}
            />
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" }}>
                <div className="container-shadow receipt-container">
                    <p className='title'>Congratulations!</p>
                    <p className='subtitle'>Here's your receipt.</p>
                    <div className="cart-card-receipt-container">
                        {
                            cart.map((
                                {
                                    dept,
                                    number,
                                    title,
                                },
                                index
                            ) => (
                                <div className='cart-card-receipt' key={index}>
                                    <div style={{ flex: 1 }}>
                                        <p className='class-title'>{dept} {number}</p>
                                        <p className='class-subtitle'>{title}</p>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
                                    </div>
                                </div>
                            )
                            )}
                    </div>
                    <div style={{ display: "flex", gap: 25 }}>
                        <button onClick={() => navigate("/")} style={{ marginTop: "1.5rem" }}>Home</button>
                        <button onClick={() => setRun(5000)} style={{ marginTop: "1.5rem" }}>More Confetti</button>
                    </div>
                </div>
            </div>
        </>

    )
}