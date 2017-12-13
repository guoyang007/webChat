为了探索 websocket 应用。

基本流程：
	* server 端对 client 端事件监听。

	比如 client 发送消息时，你可以触发一个`ChatMessage`的事件
	
	```
	submit(){
		io.emit('ChatMessage',{
			name:name,
			value:value
			});
	}
	```
	server端监听该事件的方法即可接收到value,然后广播
	`io.on('ChatMessage',function(data){
			 io.broadcast('NewMessage',{
			 	name:data.name,
			 	value:data.value
			 	})
		})`

	同样的，客户端应该有`NewMessage`的监听事件，更新数据然后展示到 UI。