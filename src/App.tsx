import React, {useCallback, useState} from 'react';
import './App.css';
import Form, {FormInputs} from "./components/Form";
import Result from "./components/Result";

function App() {

	const [data, setData] = useState({} as FormInputs);

	const updateData = useCallback((value: FormInputs) => {
		setData(value);
		return data
	}, []);

	return (
		<div className="App">
			<Form updateData={updateData}/>
			<Result {...data}/>
		</div>
	);
}

export default App;
