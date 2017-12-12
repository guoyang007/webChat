import React,{Component} from 'react'
import {observer,inject} from 'mobx-react';
require('./index.less') 
// import GridArticle from '../../components/grid-article/index.js'
const io=require('../../../node_modules/socket.io-client/socket.io.js')();

@inject("indexStore")
@inject("routing")
@observer
class Layout extends Component{
	constructor(props){
		super(props);
		this.state={
			text:'',
			lists:[]
		}
	}

	componentDidMount(){
		let that=this;
		io.on('ChatMessage',function(event){
			let curList = that.state.lists;
			curList.push(event.msg)
			that.setState({
				lists:curList
			})
		})
		io.on('join',function(event){
			console.log('id',event.id)
			console.log('current connections',event.connectionNum)
		})
		io.on('leave',function(e){
			console.log('id',e.id);
			console.log('current connections',e.connectionNum)
		})
	}

	handleChange(e){
		this.setState({
			text:e.target.value
		});
	}

	handleClick(e){
		let that=this;
		e.preventDefault();
		const value=that.state.text;
		io.emit('ChatMessage',value);
		that.setState({
			text:''
		})
	}


	render(){
		let {getIndexData}=this.props.indexStore;
		let {history}=this.props.routing;

		// let Lists=()=>{
		// 	let arr=[]
		// 	this.state.lists.map((item,index)=>{
		// 		 arr.push(<li key={index} className="item">{item}</li>)
		// 	})
		// 	return arr;
		// }
				
		// console.log('lists',Lists())
		// console.log('data',getIndexData.slice())
		return (
			<div className="app-container">
				<div className="content-left">
					<div className="left-top">
						<div className="portraint">
							<img src="" alt=""/>
						</div>
					</div>
					<div className="left-boby">
						<ul className="items">
							<li className="item">aa</li>
							<li className="item">bb</li>
							<li className="item">cc</li>
						</ul>
					</div>
				</div>
				<div className="content-right">
					<div className="room">
						<span>ROOM NAME(num)</span>
					</div>
					<ul className="msg-list">{this.state.lists.map((item,index)=>(
						<li key={index} className="item">
							<span className="text">{item}</span>
						</li>
					))}</ul>
					<form className="msg-input" action="#">
						<input value={this.state.text} onChange={this.handleChange.bind(this)} type="text"/>
						<button onClick={this.handleClick.bind(this)}>Send</button>
					</form>
				</div>
			</div>
		)
	}
}
 	
export default Layout; 
