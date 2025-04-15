import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Admin from "@/components/admin";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {isAuthAction} from "@/store/slices/productSlice";
export default function Login() {
    const dispatch = useDispatch();
    const isAuth = useSelector((state) => state.usercart.isAuth);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const host = useSelector((state) => state.usercart.host);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(host + 'api/store/login', { username, password });
            console.log('Успешный вход:', response.data.message);
            setError(null);
            dispatch(isAuthAction(true))
            console.log('ntrcn');
            
            
        } catch (error) {
            console.error('Ошибка входа:', error.response.data.message);
            setError('Неверные учетные данные');

        }

        

    };

    return (
        isAuth ? (<>
            <Admin/>
            </>
        ) : (
<div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="mb-4">Вход в учетную запись</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Логин:</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                autoComplete='admin'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Пароль:</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                autoComplete='root'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Войти</button>
                    </form>
                    {error && <p className="mt-3 text-danger">{error}</p>}
                </div>
            </div>
        </div>
        )
        
    );
};
