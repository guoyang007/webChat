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
			nums:1,
			lists:[]
		}
	}

	componentDidMount(){
		let that=this;
		
		io.on('ChatMessage',function(event){
			let curList = JSON.parse(JSON.stringify(that.state.lists));
			curList.push({
				id:event.id,
				msg:event.msg
			})
			that.setState({
				lists:curList
			})
		})
		io.on('join',function(event){
			console.log('id',event.id)
			console.log('current connections',event.connectionNum)
			that.setState({
				nums:event.connectionNum
			});
		})
		io.on('leave',function(e){
			console.log('id',e.id);
			console.log('current connections',e.connectionNum)
			that.setState({
				nums:e.connectionNum
			});
		})
	}

	componentDidUpdate(prevProps, prevState){
		if (prevState.lists.length!=this.state.lists.length) {
			if (this.el) {
				this.scrollToBottom();
			}
		}
	}

	scrollToBottom() {
    this.el.scrollIntoView({ behaviour: 'smooth' });
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
						<span>ROOM NAME ({this.state.nums})</span>
					</div>
					<div className="msg-list">
					{this.state.lists.map((item,index)=>(
						<div key={index} className="item" ref={index==this.state.lists.length-1? el => this.el = el :null}>
							<span className="name">{item.id.substring(item.id.length-6)}</span>
							<span className="text">{item.msg}</span>
						</div>
					))}</div>
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
