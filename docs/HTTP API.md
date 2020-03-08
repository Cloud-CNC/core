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
--- | --- | --- | --- | --- | --- | ---
Sessions | POST | /sessions/login | N/A | `{"username": String, "password": String}` | `{"valid": Boolean, "mfa": Boolean}` | Logs user in. If user has MFA enabled, they'll need to POST to `/sessions/mfa` to complete the login process.
Sessions | POST | /sessions/mfa | N/A | `{"otp": String}` | `{"valid": Boolean}` | Logs user in. Only required if user has MFA enabled.
Sessions | POST | /sessions/logout | N/A | N/A | N/A | Logs user out.
| | | | | | |
Accounts | GET | /accounts/all | N/A | N/A | `{"accounts": Account[]}` | Gets all accounts.
Accounts | GET | /accounts/roles | N/A | N/A | `{"roles": String[]}` | Get all roles.
Accounts | POST | /accounts | N/A | `{"role": String, "username": String, "password": String}, "mfa": Boolean` | `{"id": String, "otpauth": String`<sup>1</sup>`}` | Creates an account.
Accounts | POST | /accounts/:id/impersonate | `id: String` | `{"enabled": Boolean}` | N/A | Impersonates account, all actions performed by user will be performed on behalf of the target account until the user stops impersonation.
Accounts | GET | /accounts/:id | `id: String` | N/A | `{"account": {"id": String, "role": String, "username": String}}` | Gets an account's information.
Accounts | PATCH | /accounts/:id | `id: String` | `{"role": String, "username": String, "password": String}, "mfa": Boolean}` | `{"otpauth": String`<sup>1</sup>`}` | Updates part(s) of an account.
Accounts | DELETE | /accounts/:id | `id: String` | N/A | N/A | Deletes an account.
| | | | | | |
Files | GET | /files/all | N/A | N/A | `{"files": File[]}` | Gets all files for a user. *(The raw attribute will not be present)*
Files | POST | /files | N/A | `{"name": String, "description": String, "raw": String}` | `{"id": String}` | Creates a file.
Files | GET | /files/:id | `id: String` | N/A | `{"file": {"id": String, "status": Number,	"owner": String, "name": String, "description": String}, "raw": String}` | Gets a file.
Files | PATCH | /files/:id | `id: String` | `{"name": String, "description": String` | N/A | Updates part(s) of a file.
Files | DELETE | /files/:id | `id: String` | N/A | N/A | Deletes a file.
| | | | | | |
Trash | GET | /trash/all | N/A | N/A | `{"files": File[]}` | Gets all trashed files for a user. *(The raw attribute will not be present)*
Trash | PUT | /trash/:id | `id: String` | N/A | N/A | Recovers a trashed file.
Trash | DELETE | /trash/:id | `id: String` | N/A | N/A | Deletes a file permanently.
| | | | | | |
Controller | GET | /controllers/all | N/A | N/A | `{"controllers": Controller[]}` | Get all controllers.
Controller | POST | /controllers | N/A | `{"name": String}` | `{"id": String, "key": String}` | Creates a controller.
Controller | GET | /controllers/:id | `id: String` | N/A | `{"controller": {"id": String, "name": String, "key": String}` | Gets a controller's information.
Controller | PATCH | /controllers/:id | `id: String` | `{"name": String}` | N/A | Updates part(s) of a controller.
Controller | DELETE | /controllers/:id | `id: String` | N/A | N/A | Deletes a controller.
| | | | | | |
Machines | GET | /machines/all | N/A | N/A | `{"machines": Machine[]}` | Get all machines.
Machines | POST | /machines | N/A | `{"controller": String, "name": String, "tags": String, "length": String, "width": String, "height": String}` |  `{"id": String}` | Creates a machine.
Machines | GET | /machines/:id | `id: String` | `{"machine": {"id": String, "controller": String, "name": String, "tags": String, "length: Number, "width": Number, "height": Number}}` | Public | Gets a machines's information.
Machines | POST | /machines/:id/command | `id: String` | `{"command": String}` | `{"response": String}` | Sends a *small* command to a machine.
Machines | POST | /machines/:id/execute | `id: String` | `{"file": String}` | N/A | Start executing the specified file on the specified machine.
Machines | PATCH | /machines/:id | `id: String` | `{"controller": String, "name": String, "tags": String, "length": String, "width": String, "height": String}` | N/A | Updates a machine.
Machines | DELETE | /machines/:id | `id: String` | N/A | N/A | Deletes a machine.

1. Only present if the account has MFA enabled