import "./index.scss"
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const LoadingPage = () => {
    const navigate = useNavigate()
    const { tokenId } = useParams()

    const texts = [
        'Repairing walls on the map.',
        'Placing coins on the map',
        'Preparing food for the beasts, please wait patiently!',
        'The beasts are currently dining, please wait patiently!',
        'Driving the beasts into the battle map',
        '"Your life is entering a life-or-death contract."',
        'The game is ready and about to begin!'
    ];
    const [number, setNumber] = useState(1);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const random = Math.random() * (6 - 3) + 3;
        const interval = setInterval(() => {
            setNumber(prevNumber => prevNumber + 1);
        }, random*10);

        if (number === 100) {
            clearInterval(interval);
            setTimeout(() => {
                navigate(`/game/${tokenId}`)
            }, 2000)
        }

        return () => clearInterval(interval);
    }, [number]);
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((previousIndex) => (previousIndex + 1) % texts.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);
    return (
        <div className={"loading-container"}>
            <div className="round-pie">
            </div>
            <div className="text-box">
                <div className="text-container">
                    <div className="rowup">
                        {texts.map((item, idx) => (
                            <div key={idx} className={`text-item ${idx === activeIndex ? 'text-item-active' : ''}`}>{item}</div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="progress-container">
            </div>
            <div className="progress-block-container">
                <div className="block" style={{width: number+'%'}}></div>
                <div className="number-box" style={{width: number+'%'}}>
                    <div className="number">{number}%</div>
                </div>
            </div>
        </div>
    )
}
export {
    LoadingPage
}