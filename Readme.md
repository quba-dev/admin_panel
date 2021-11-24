<h1>Admin-Panel</h1>


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run dev

# production mode
$ npm run start
```

# Endpoints
<b>POST</b> Registration - ``/auth/registration``

payload:
``` json
    {   
        "username": string;
        "email": string;
        "first_name": string;
        "last_name": string;
        "password": string;
        "password_confirmation": string;
    }
```
<b>GET</b> Activation link - ``/auth/activate/:token``

<b>GET</b> Reset password - ``/auth/reset_password/``

<b>POST</b> Change password - ``/auth/change_password/:token``

<b>POST</b> Login - ``/auth/login``

payload:
``` json
    {
        "username": string;
        "password": string;
        "password_confirmation": string;
    }
```

<b>GET</b> Logout - ``/auth/logout``

<b>GET</b> Users - ``/auth/users``

Headers:
```
    {
        "Authorization": "Bearer :token"
    }
```
Result:
```
        {
        "_id": "619e08088d4b424188188291",
        "username": "example",
        "email": "example@example.com",
        "first_name": "example",
        "last_name": "example",
        "isDeleted": false,
        "isActivated": true,
        "isBanned": false,
        "role": "example",
        "created_at": "2021-11-24T09:38:17.158Z",
        "updated_at": "2021-11-24T09:42:04.379Z"
    }
```


<b>POST</b> Reset Password - ``/auth/reset_password``

payload:
``` json
    {
        "username": string;
    }
```
or 

``` json
    {
        "email": string;
    }
```


<b>POST</b> Create Role - ``/create_role``

Headers:
```
    {
        Authorization: Bearer :token
    }
```

payload:
``` json
    {
        "role": string;
    }
```


<b>PUT</b> Change User - ``/change_user_role``

Headers:
```
    {
        Authorization: Bearer :token
    }
```

payload:
``` json
    {
        "username": string;
        "role": string;
    }
```

<b>POST</b> Ban user - ``/ban_user``

Headers:
```
    {
        Authorization: Bearer :token
    }
```

payload:
``` json
    {
        "username": string;
    }
```

<b>POST</b> Create product - ``/api/product``

Headers:
```
    {
        Authorization: Bearer :token
    }
```

payload:
``` json
    {
        "tittle": string;
        "content": string;
    }
```

<b>GET</b> Get all products - ``/api/products``

<b>GET</b> Get one product - ``/api/product/:id``

<b>PUT</b> Update product - ``/api/product/:id``

Headers:
```
    {
        Authorization: Bearer :token
    }
```

payload:
``` json
    {
        "tittle": string;
        "content": string;
    }
```

<b>DELETE</b> Product - ``/api/product/:id``



## Stay in touch

- Author - [quba](https://t.me/lapots)
