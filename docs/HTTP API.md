# HTTP API Specification

## Endpoint
The HTTP API is available at `https://<your domain or ip>/api/`.

## Authentication
Authentication is solely handled by the sessions API family. Users must authenticate themselves via the login route, afterwhich, they will receive a cookie named `session` containing a cookie managed by the `express-session` middleware. The cookie is then used to authenticate the user on all subsequent requests.

## Permissions
Cloud CNC is *currently* designed for 2 types of accounts (`Admin` and `User`). In the future, granular permissions will hopefully be added.


## Response handling

The reccommended way to handle an API response is to use the REST API Wrapper (`api.js`). The wrapper will automatically parse JSON and handle errors thrown by the server. The wrapper is compatible with all API routes. **Note: the wrapper will reject the promise if an error occurs.**

```javascript
import api from '../api.js';
api.<FAMILY>.<ACTION>(<PARAMETERS>).then(res =>
{
	//Do stuff with 'res'
});
```

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

## Routes
*PATCH requests accept **1** or more parameters. If the intended account is the currently logged in account, use `own` as the `:id` parameter*

Family | Method | Route | Route Parameters | Body | Response | Description
--- | --- | --- | --- | --- | --- | --- | ---
Sessions | POST | /sessions/login | N/A | `{"username": <string>, "password": <string>}` | `{"valid": <boolean>, "mfa": <boolean>}` | Logs user in. If user has MFA enabled, they'll need to POST to `/sessions/mfa` to complete the login process.
Sessions | POST | /sessions/mfa | N/A | `{"otp": <string>}` | `{"valid": <boolean>}` | Logs user in. Only required if user has MFA enabled.
Sessions | POST | /sessions/logout | N/A | N/A | N/A | Logs user out.
| | | | | | |
Accounts | GET | /accounts/all | N/A | N/A | `{"accounts": <array/account>}` | Gets all accounts.
Accounts | POST | /accounts | N/A | `{"role": <string/role>, "firstName": <string>, "lastName": <string>, "username": <string>, "password": <string>}, "mfa": <boolean>` | `{"id": <string>, "otpauth": <string>`<sup>1</sup>`}` | Creates an account.
Accounts | GET | /accounts/:id | `id: <string>` | N/A | `{"account": {"id": <string>, "role": <string/role>, "firstName": <string>, "lastName": <string>, "username": <string>}}` | Gets an account's information.
Accounts | PATCH | /accounts/:id | `id: <string>` | `{"role": <string/role>, "firstName": <string>, "lastName": <string>, "username": <string>, "password": <string>}, "mfa": <boolean>` | N/A | Updates part(s) of an account.
Accounts | DELETE | /accounts/:id | `id: <string>` | N/A | N/A | Deletes an account.
| | | | | | |
Files | GET | /files/all | N/A | N/A | `{"files": <array/file>}` | Gets all files for a user. *(The raw attribute will not be present)*
Files | POST | /files | N/A | `{"name": <string>, "description": <string>, "raw": <string/GCODE>}` | `{"id": <string>}` | Creates a file.
Files | GET | /files/:id | `id: <string>` | N/A | `{"file": {"id": <string>, "status": <number>,	"owner": <string>, "name": <string>, "description": <string>}, "raw": <string/GCODE>}` | Gets a file.
Files | PATCH | /files/:id | `id: <string>` | `{"name": <string>, "description": <string>` | N/A | Updates part(s) of a file.
Files | DELETE | /files/:id | `id: <string>` | N/A | N/A | Deletes a file.
| | | | | | |
Trash | GET | /trash/all | N/A | N/A | `{"files": <array/file>}` | Gets all trashed files for a user. *(The raw attribute will not be present)*
Trash | PUT | /trash/:id | `id: <string>` | N/A | N/A | Recovers a trashed file.
Trash | DELETE | /trash/:id | `id: <string>` | N/A | N/A | Deletes a file permanently.
| | | | | | |
Controller | GET | /controllers/all | N/A | N/A | `{"controllers": <array/controller>}` | Get all controllers.
Controller | POST | /controllers | N/A | `{"name": <string>}` | `{"id": <string>, "key": <string>}` | Creates a controller.
Controller | GET | /controllers/:id | `id: <string>` | N/A | `{"controller": {"id": <string>, "name": <string>, "key": <string/key>}` | Gets a controller's information.
Controller | PATCH | /controllers/:id | `id: <string>` | `{"name": <string>}` | N/A | Updates part(s) of a controller.
Controller | DELETE | /controllers/:id | `id: <string>` | N/A | N/A | Deletes a controller.
| | | | | | |
Machines | GET | /machines/all | N/A | N/A | `{"machines": <array/machine>}` | Get all machines.
Machines | POST | /machines | N/A | `{"controller": <string>, "name": <string>, "tags": <string>, "length": <string>, "width": <string>, "height": <string>}` |  `{"id": <string>}` | Creates a machine.
Machines | GET | /machines/:id | `id: <string>` | `{"machine": {"id": <string>, "controller": <string>, "name": <string>, "tags": <string>, "length: <number>, "width": <number>, "height": <number>}}` | Public | Gets a machines's information.
Machines | POST | /machines/:id/command | `id: <string>` | `{"command": <string>}` | `{"response": <string>}` | Sends a *small* command to a machine.
Machines | POST | /machines/:id/execute | `id: <string>` | `{"file": <string>}` | N/A | Start executing the specified file on the specified machine.
Machines | PATCH | /machines/:id | `id: <string>` | `{"controller": <string>, "name": <string>, "tags": <string>, "length": <string>, "width": <string>, "height": <string>}` | N/A | Updates a machine.
Machines | DELETE | /machines/:id | `id: <string>` | N/A | N/A | Deletes a machine.

1. Only present if the account has MFA enabled