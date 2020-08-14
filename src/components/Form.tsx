import React, {ChangeEvent, FC, useEffect, useState} from "react";
import {instance} from '../source/test4'

export type FormInputs = {
    name: string
    surname: string
    email: string
    phone: number
}

const Form: FC<any> = (props) => {

    const [name, setName] = useState(instance.name);
    const [surname, setSurname] = useState(instance.surname);
    const [email, setEmail] = useState(instance.email);
    const [phone, setPhone] = useState(instance.phone);

    let allstate: FormInputs = {surname, name, phone, email};

    localStorage.setItem('storage', JSON.stringify(allstate));

    useEffect(() => {
        instance.surname = surname;
        instance.name = name;
        instance.phone = phone;
        instance.email = email;
        props.updateData(allstate);
    }, [name, surname, phone, email]);

    const changeValue = (e: ChangeEvent<HTMLInputElement>) => {
        switch (e.target.name) {
            case 'name':
                setName(e.target.value);
                return;
            case 'surname':
                setSurname(e.target.value);
                return;
            case 'phone':
                setPhone(+e.target.value);
                return;
            case 'email':
                setEmail(e.target.value);
                return
        }
    };

    return (
        <div className="form part">
            <h1 className="title">Form</h1>
            <form>
                <label>
                    <div>Ім'я:</div>
                    <input type="text"
                           name="name"
                           value={name}
                           onChange={changeValue}
                    />
                </label>
                <label>
                    <div>Прізвище:</div>
                    <input type="text"
                           name="surname"
                           value={surname}
                           onChange={changeValue} />
                </label>
                <label>
                    <div>Email:</div>
                    <input type="email"
                           name="email"
                           value={email}
                           onChange={changeValue} />
                </label>
                <label>
                    <div>Телефон:</div>
                    <input type="number"
                           name="phone"
                           value={phone}
                           onChange={changeValue} />
                </label>
            </form>
        </div>
    )
};

export default Form;