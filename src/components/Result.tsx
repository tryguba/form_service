import React, {FC} from "react";
import {TrackedProperty} from "../source/reactive/tracked.property";
import {FormInputs} from "./Form";

class Result extends React.Component<FormInputs, {}> {

	@TrackedProperty({
		initial(): any {
			return 'Vasya';
		},
	})
	public name: string;

	@TrackedProperty({
		initial(): any {
			return 'Pupkin';
		},
	})
	public surname: string;

	@TrackedProperty({
		initial(): any {
			return 'pupkin@gmail.com';
		},
	})
	public email: string;

	@TrackedProperty({
		initial(): any {
			return 333255828;
		},
	})
	public phone: number | null;


	render() {
		const {name, surname, email, phone} = this.props
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