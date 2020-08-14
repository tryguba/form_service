import React from "react";
import {FormInputs} from "./Form";

class Result extends React.Component<FormInputs, {}> {

	render() {
		const {name, surname,email, phone} = this.props;
		return (
			<div className="form part">
				<h1 className="title">Result</h1>
				<form>
					<div>{name}</div>
					<div>{surname}</div>
					<div>{email}</div>
					<div>{phone}</div>
				</form>
			</div>
		)
	}
}

export default Result;