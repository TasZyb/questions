import { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import "react-intl-tel-input/dist/main.css";

export function Tabs({ option, setAnswers, currentQuestion, answers, setCurrentQuestion, questions, setQuizCompleted }) {
    const handleAnswer = (answer) => {
        setAnswers([...answers, answer]);
        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setQuizCompleted(true);
        }
    };

    return (
        <div className="tabs">
            {option.options.map((quest, index) => (
                <button key={index} onClick={() => handleAnswer(quest)}>
                    {quest}
                </button>
            ))}
        </div>
    );
}

export function Form({ answers, setQuizCompleted, setAnswers }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");

    const validateForm = () => {
        if (!name || !email || !phone) {
            setError("Всі поля мають бути заповнені!");
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError("Невірний формат email!");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = {
            name,
            email,
            phone,
            answers,
        };

        try {
            const response = await fetch("/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("Дані відправлено!");
                console.log(data);
                
            } else {
                alert("Помилка при відправці!");
                console.log(data);
            }
        } catch (error) {
            console.error("Помилка:", error);
        }
    };

    const closePopup = () => {
        setAnswers(prevAnswers => prevAnswers.slice(0, -1));
        setQuizCompleted(false)
    }

    return (
        <div className="modal">
            <div className="modal__background" onClick={() => closePopup()}></div>
            <form onSubmit={handleSubmit} className="modal__body">
                <h2>Форма реєстрації</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}

                <input type="text" placeholder="Ім'я" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <PhoneInput
                    country={'ua'}
                    value={phone}
                    onChange={setPhone}
                    className="modal__country"
                    />

                <button type="submit">Відправити</button>
            </form>
        </div>

        
    );
}





export default function QestionBar() {
    const questions = [
        { question: "Що таке React?", options: ["Бібліотека", "Фреймворк"] },
        { question: "Що таке JSX?", options: ["Розширення JS", "Мова програмування"] },
        { question: "useState – це?", options: ["Хук", "Компонент"] },
        { question: "Що таке props?", options: ["Аргументи", "Функції"] },
        { question: "Що робить useEffect?", options: ["Побічні ефекти", "Рендеринг"] },
    ];

    const [answers, setAnswers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    

    return (
        <div className="wrapper__main">
            <h1>Live Busy status</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                <>
                    <Tabs
                        questions={questions}
                        option={questions[currentQuestion]}
                        setAnswers={setAnswers}
                        currentQuestion={currentQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                        answers={answers}
                        setQuizCompleted={setQuizCompleted}
                    />
                    <div className="res">{currentQuestion + 1}/5</div>
                </>
                {quizCompleted && <Form answers={answers} setAnswers={setAnswers} setQuizCompleted={setQuizCompleted} />}
            
        </div>
    );
}
