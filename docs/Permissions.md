# Permissions Documentation
Documentation for the **upcoming** revised permissions system.

## Global Permissions
Cloud CNC uses an RBAC (Role-Based Access Control) system for the majority of actions. Global permissions are only configurable by admins via the web GUI.

### Roles
As a Cloud CNC administrator, you can create as many roles as you want. Cloud CNC comes with 2 default roles: `User` and `Admin`. Permissions are inheritied from the lowest ranking role (`User`) to the highest (`Admin`) meaning if the `User` role is granted the `machines:get` permission, the `Admin` role will automatically gain this permission as well. To configure account specific permissions, you must create a role just for that account. Without the `<family>:admin` permission, accounts within a role may only perform actions on its own (seperate) entities.

### Defaults

Name | User | Admin | Description
--- | --- | --- | ---
accounts:admin | ❌ | ✔️ | Administrate other accounts
accounts:all | ❌ | ✔️ | Get all accounts
accounts:create | ❌ | ✔️ | Create an account
accounts:get | ✔️ | ✔️ | Get an account
accounts:update | ✔️ | ✔️ | Update an account
accounts:remove | ✔️ | ✔️ | Remove an account
| | |
files:admin | ❌ | ✔️ | Administrate other accounts' files
files:all | ✔️ | ✔️ | Get all files
files:create | ✔️ | ✔️ | Create a file
files:get | ✔️ | ✔️ | Get a file
files:update | ✔️ | ✔️ | Update a file
files:remove | ✔️ | ✔️ | Remove a file
| | |
trash:admin | ❌ | ✔️ | Administrate other accounts' trash
trash:all | ✔️ | ✔️ | Get all files in trash
trash:recover | ✔️ | ✔️ | Recover file
trash:remove | ✔️ | ✔️ | Permanently remove file
| | |
controllers:all | ✔️ | ✔️ | Get all controllers
controllers:create | ❌ | ✔️ | Create a controller
controllers:get | ✔️ | ✔️ | Get a controller
controllers:update | ❌ | ✔️ | Update a controller
controllers:remove | ❌ | ✔️ | Remove a controller
| | |
machines:all | ✔️ | ✔️ | Get all machines
machines:create | ❌ | ✔️ | Create a machine
machines:get | ✔️ | ✔️ | Get a machine
machines:command | ✔️ | ✔️ | Send a command to a machine
machines:execute | ✔️ | ✔️ | Execute a file on a machine
machines:update | ❌ | ✔️ | Update a machine
machines:remove | ❌ | ✔️ | Remove a machine