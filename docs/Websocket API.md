# Websocket API Specification

## Endpoint
The Websocket API is available at `wss://<your domain or ip>`.

## Authentication
A key will be generated and provided to the user when they create a controller via the web interface. The key is then entered into the controller's configuration file. When the controller initiates contact with the websocket server, the key in addition to the controller's ID is provided to the websocket server via a header named `key` and `_id` respectively.

## Error handling

All errors will be JSON encoded and in the following format:
```javascript
{
	"error": {
		"name": "Short yet descriptive message",
		"description": "Longer message, detailing how to avoid/fix the underlying cause for the error"
	}
}
```

## Messages
*All JSON messages must contain the `event` property. The `_id` property is used for message responses.*

Initiator | Body | Response | Description
--- | --- | --- | ---
API Server | `{"_id": <string>, "event": "command", "machine": <string>, "command": <string>}` | `{"_id": <string>, "event": "response:command", "machine": <string>, "response": <string>}` | Sends a *small* command to the controller which forwards it to the specified machine.
API Server | `{"_id": <string>, "event": "execute", "machine": <string>, "file": <string>}` | `{"_id": <string>, "event": "response:execute", "machine": <string>, "success": <boolean>}` | Sends a file to the controller which forwards it to the designated machine.