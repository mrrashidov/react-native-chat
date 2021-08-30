# react-native-chat

# how to send Notification ?

```js
//const { user_id, title,body,data } = params
/*all params required*/
expoSender(params).then(response => {
	console.log(response)
	//this response success or error
})
```

```shell
curl -H "Content-Type: application/json" -X POST "http://localhost:9000/notification/send" -d '{
  "user_id": "1",
  "title":"hello",
  "body": "world",
  "data": "{ok:true}",
}'
```
