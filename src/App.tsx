import React, {useCallback, useState} from 'react';
import './App.css';
import Form, {FormInputs} from "./components/Form";
import Result from "./components/Result";
// Задача:
// 	- Розробити сервіс з "реактивними" властивостями ("Ім'я", "Прізвище", "Email", "Телефон"), єдиний екземпляр сервісу зберігати у window
// - Розробити форму з полями для вводу значень безпосередньо у властивості сервісу
// - Розробити компонент, який буде відображати актуальні значення властивостей сервісу

function App() {

	const [data, setData] = useState({} as FormInputs)

	const updateData = useCallback((value: FormInputs) => {
		setData(value)
		return data
	}, [])

	return (
		<div className="App">
			<Form updateData={updateData}/>
			<Result {...data}/>
		</div>
	);
}

export default App;
