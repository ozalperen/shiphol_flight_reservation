# Shiphol-flight-reservation

A basic pseudo flight reservation API for Shiphol Airport.

## Dependencies

- Docker (v20.10.18)

- NodeJs (v16.x)

- yarn (v1.22.19)

## Installation

1. Clone the project

2. fill the .env file:
   
   .env file requires JWT token private keys, smtp mail settings, postgres setting. It's also possible to configure a reverse proxy if needed with an existing network by editing docker-compose.yml.

3. Setup Redis and Postgres
   
   ```bash
   docker-compose up -d
   ```

4. Install dependencies
   
   ```bash
   yarn install
   ```

5. Create database tables
   
   ```bash
   yarn migrate && yarn db:push
   ```

## Run (Development)

```bash
yarn start
```

## API

**Development base url:** http://localhost:8000

**postman collection:**  https://www.getpostman.com/collections/eee3b927e328bfca1015

### Authentication

Bearer token authorization is required for most of the requests.

### User Register and Login

| Method | Route                                   | Function                                                                            | Authentication |
| ------ | --------------------------------------- | ----------------------------------------------------------------------------------- | -------------- |
| POST   | /api/auth/register                      | registers new user and sends a verification e-mail                                  | Not required   |
| POST   | /api/auth/login                         | provides an access token (valid for 60 mins) and a refres token (valid for an hour) | Not required   |
| GET    | /api/auth/refresh                       | gets a new access token (valid for a day)                                           | Required       |
| GET    | /api/auth/logout                        | logs out user                                                                       | Required       |
| GET    | /api/auth/verifyemail/:verificationcode | verifys users email                                                                 | Not required   |
| POST   | /api/auth/emailresend                   | resends verification email                                                          | Not required   |
| POST   | /api/auth/forgotpass                    | sends an e-mail for password reset                                                  | Not required   |
| POST   | /api/auth/updatepassword                | updates password with password reset code                                           | Not required   |

#### Register

**Function:** Registers new user and sends a verification e-mail.

**Method:** POST

**route:** /api/auth/register

**expected JSON body:**

```json
{
"name":"alp eren özalp",
"email":"alperenoz93@gmail.com",
"password":"password1222",
"passwordConfirm":"password1222"
}
```

**Expected Response:**

Status: **201 Created**

```json
{
  "status": "success",
  "message": "An email with a verification code has been sent to your email"
}
```

**Errors:**

| code | message                                            | note                                        | status |
| ---- | -------------------------------------------------- | ------------------------------------------- | ------ |
| 500  | There was an error sending email, please try again | check src/utils/email.ts smtp configuration | error  |
| 409  | User with that email already exist                 |                                             | fail   |

#### E-mail Verification

**Function:** Verifys users email

**Method:** GET

**route:** /api/auth/verifyemail

**expected parameters:**

```json
/verificationCode
```

**Expected JSON Response:**

Status: **200 success**

```json
{
  "status": "success",
  "message": "Email verified successfully"
}
```

**Errors:**

| code | message                | note           | status |
| ---- | ---------------------- | -------------- | ------ |
| 401  | Could not verify email | check the link | error  |

#### Login

**Function:** Provides an access token (valid for 15 mins) and a refres token (valid for an hour). You have to refresh the acces token by using the refresh token.

**Method:** POST

**route:** /api/auth/login

**expected JSON body:**

```json
{"email":"alperenoz93@gmail.com",
"password":"password1222"}
```

**Expected Response:**

Status: **200 Success**

```json
{
  "status": "success",
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDNhOTNmMi01NGE5LTQ4NzEtOTAzMi05ZmFjZThlZmNiNDQiLCJpYXQiOjE2NTkzMDUyNTcsImV4cCI6MTY1OTMwNTMxN30.AT53qAZ5jcp_FNN_M8vSgeM1SYzrZJa-RJIyFWLNCZDrYEblQlOekhfC7xveAfSNWaoyurFj3u8dBdk9ZwbjVio0Cg-KNCTk8IC2qX8EN6dKkm3GEvqOlH5sqYmNTvtD2FCDSuBgi1cgE6FV9M7cViW3VaLPixwPalvOMqU0Y082WPrPQPfHal3Dppdn_4ZIM2ktMh9NCoLo6JZFluUyfhJmL1wuVxiATmeMe46YIbMdD1l7r-xG5l29P_TUOhQZkYsr59DCP4bslPnqznh2HVfqZQShNfN7N9OkyyaNwxD1LRdr_PMt9iEIZkEnD0XdNSQd0jYzUrZHNYwf2zE4ug",
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDNhOTNmMi01NGE5LTQ4NzEtOTAzMi05ZmFjZThlZmNiNDQiLCJpYXQiOjE2NTkzMDUyNTcsImV4cCI6MTY1OTMwODg1N30.DNzEP_RPkFnSUy2SZ6v59HJv5QynpnplTX9sZ-V_Ppbrrn3_04EwJKaQYfXxE2xREC2Ywo2I2rr4zRaX4FpxYiKDSUBNBpqzIeLOLTk99DFFjrQ8yq-4Ei6DztmJvyccqA9NY6e11bFMAHEwHEqwBmZ5KFg7a9b41zSm25Py0ArC3BQmZslZ3ChabOJ5EbGCrTEuubfgOs-jKn0aomguduIMvFiCTFT22Zo0VZBNZUuZIHS4o6ah8ydUC3vlpCtK946OdMZUbjZ86g25gyqtxNqRfPFtHsHaE9lfbexP9Y9JntgURh3E8CmvxbG-8Pw3LCsHT8AmZ3PX0hFDMWfodg"
}
```

**Errors:**

| code | message                   | note                    | status |
| ---- | ------------------------- | ----------------------- | ------ |
| 400  | Invalid email or password | check email and passwod | error  |

#### Get Password recovery code

**Function:** sends an e-mail for password reset

**Method:** POST

**route:** /api/auth/forgotpass

**expected JSON body:**

```json
{"email":"alperenoz93@gmail.com"}
```

**Expected Response:**

Status: **200 success**

```json
{
  "status": "success",
  "message": "An email with a verification code has been sent to your email"
}
```

#### Update Password

**Function:** sends an e-mail for password reset

**Method:** POST

**route:** /api/auth/updatepassword

**expected JSON body:**

```json
{
    "email":"alperenoz93@gmail.com",
    "passwordUpdateCode":"23e81d9e504a6805",
    "password":"mynewpassword",
    "passwordConfirm":"mynewpassword"
}
```

**Expected Response:**

**Status:** 201 created

```json
{
  "status": "success",
  "message": "Your password has been updated. Please login with your new password."
}
```

### User Requests

| Method | Route          | Function                                    | Authentication |
| ------ | -------------- | ------------------------------------------- | -------------- |
| GET    | /api/users/me/ | Displays profile info of authenticated user | Required       |

### Searching Flights and Getting Flight Details

Any request to the both /api/flights/ and api/flights/:scipholId searches flights from Sciphol Airport API. Flights appeared on the search results gets written to the local database. If already cached flight re-appears it gets updated.  

| Method | Route                  | Function                                                        | Authentication |
| ------ | ---------------------- | --------------------------------------------------------------- | -------------- |
| POST   | /api/flights/          | Search for flights by direction, destination on a date interval | Required       |
| GET    | api/flights/:scipholId | Get  detailed information for a single flight                   | Required       |

#### Search for A Flight with Filters

**Method:** POST

**route:** /api/flights/

**JSON body parameters:**

flightDirection: Direction of the flight  ("A" for arrival and "D" for departures)

route: IATA or ICAO code of airport in route

fromScheduleDate: Query by ScheduleDate range.

toScheduleDate: Query by ScheduleDate range

Note: The difference of fromScheduleDate and toScheduleDate must not be larger than 3 days. 

**expected JSON body sample:**

```json
{
    "flightDirection":"D",
    "route": "SAW",
    "fromScheduleDate": "2022-10-09",
    "toScheduleDate": "2022-10-09"
}
```



**Expected Response sample:**

Status: **200 OK**

```json
{
    "status": "success",
    "data": {
        "cachedFlights": [
            {
                "id": "37132c41-e91f-4d4b-8121-20b6f0241555",
                "created_at": "2022-10-08T17:12:12.150Z",
                "updated_at": "2022-10-08T17:13:23.835Z",
                "scipholid": "135673034205682379",
                "flightName": "TK7769",
                "flightNumber": "7769",
                "flightDirection": "D",
                "scheduleDateTime": "2022-10-09T10:30:00.000Z",
                "scheduleDate": "2022-10-08T21:00:00.000Z",
                "scheduleTime": "12:30:00",
                "route": [
                    "SAW"
                ],
                "avalibleSeats": [
                    "1", "2", "3", "4", "5", "6", "7",  "8", "9",             "10",
                    "11", "12", "13", "14", "15", "16", "17", "18"
                ]
            },
            {
                "id": "f6033a47-0eb1-4f7d-8f20-b8bae6f21592",
                "created_at": "2022-10-08T17:12:12.155Z",
                "updated_at": "2022-10-08T17:12:12.155Z",
                "scipholid": "135673033620322533",
                "flightName": "PC1252",
                "flightNumber": "1252",
                "flightDirection": "D",
                "scheduleDateTime": "2022-10-09T10:35:00.000Z",
                "scheduleDate": "2022-10-08T21:00:00.000Z",
                "scheduleTime": "12:35:00",
                "route": [
                    "SAW"
                ],
                "avalibleSeats": [
                    "1", "2", "3", "4", "5", "6", "7",  "8", "9",             "10",
                    "11", "12", "13", "14", "15", "16", "17", "18"
                ]
            },
            {
                "id": "87948270-e7ba-4912-b9eb-b20dd7d0e758",
                "created_at": "2022-10-08T17:12:12.159Z",
                "updated_at": "2022-10-08T17:12:12.159Z",
                "scipholid": "135673034205684809",
                "flightName": "TK7823",
                "flightNumber": "7823",
                "flightDirection": "D",
                "scheduleDateTime": "2022-10-09T14:25:00.000Z",
                "scheduleDate": "2022-10-08T21:00:00.000Z",
                "scheduleTime": "16:25:00",
                "route": [
                    "SAW"
                ],
                "avalibleSeats": [
                    "1", "2", "3", "4", "5", "6", "7",  "8", "9",             "10",
                    "11", "12", "13", "14", "15", "16", "17", "18"
                ]
            },
            {
                "id": "15c868d7-d4eb-419d-9d2c-1bd59555af97",
                "created_at": "2022-10-08T17:12:12.163Z",
                "updated_at": "2022-10-08T17:12:12.163Z",
                "scipholid": "135673033620322537",
                "flightName": "PC1254",
                "flightNumber": "1254",
                "flightDirection": "D",
                "scheduleDateTime": "2022-10-09T14:30:00.000Z",
                "scheduleDate": "2022-10-08T21:00:00.000Z",
                "scheduleTime": "16:30:00",
                "route": [
                    "SAW"
                ],
                "avalibleSeats": [
                    "1", "2", "3", "4", "5", "6", "7",  "8", "9",             "10",
                    "11", "12", "13", "14", "15", "16", "17", "18"
                ]
            }
        ]
    }
}
```

**Errors:**

| code | message                                                  | note                                                                                                 | status  |
| ---- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| 400  | ____ is required                                         | the request expects all of the search filter parameters                                              | fail    |
| 400  | The date interval is not valid. ____                     | Allowed days between the from and to dates is 3 and from date must be a date before to Schedule Date | fail    |
| 204  | No flight has been found with provided search parameters | No flight has been found with provided search parameters                                             | success |

#### Get Detailed Flight Info

**Method:** POST

**route:** api/flights/:scipholId

**parameters:** /scipholId

**expected parameter sample:**

```json
/scipholId
```

**Expected JSON Response sample:**

Status: **200 OK**

```json
{
    "status": "success",
    "data": {
        "flightInfo": {
            "id": "37132c41-e91f-4d4b-8121-20b6f0241555",
            "created_at": "2022-10-08T17:12:12.150Z",
            "updated_at": "2022-10-08T17:13:23.835Z",
            "scipholid": "135673034205682379",
            "flightName": "TK7769",
            "flightNumber": "7769",
            "flightDirection": "D",
            "scheduleDateTime": "2022-10-09T10:30:00.000Z",
            "scheduleDate": "2022-10-08T21:00:00.000Z",
            "scheduleTime": "12:30:00",
            "route": [
                "SAW"
            ],
            "avalibleSeats": [
               "1", "2", "3", "4", "5", "6", "7",  "8", "9", "10",
               "11", "12", "13", "14", "15", "16", "17", "18"
            ]
        },
        "detailedFlightInfo": {
            "lastUpdatedAt": "2022-10-08T17:51:40.399+02:00",
            "actualLandingTime": null,
            "actualOffBlockTime": null,
            "aircraftRegistration": null,
            "aircraftType": {
                "iataMain": "737",
                "iataSub": "73H"
            },
            "baggageClaim": null,
            "checkinAllocations": {
                "checkinAllocations": [
                    {
                        "endTime": "2022-10-09T11:30:00.000+02:00",
                        "rows": {
                            "rows": [
                                {
                                    "position": "25",
                                    "desks": {
                                        "desks": [
                                            {
                                                "checkinClass": {
                                                    "code": "C",
                                                    "description": "Business class"
                                                },
                                                "position": 1
                                            },
                                            {
                                                "checkinClass": {
                                                    "code": "C",
                                                    "description": "Business class"
                                                },
                                                "position": 2
                                            },
                                            {
                                                "checkinClass": {
                                                    "code": "B",
                                                    "description": "Baggage drop-off"
                                                },
                                                "position": 3
                                            },
                                            {
                                                "checkinClass": {
                                                    "code": "Y",
                                                    "description": "Economy"
                                                },
                                                "position": 4
                                            },
                                            {
                                                "checkinClass": {
                                                    "code": "Y",
                                                    "description": "Economy"
                                                },
                                                "position": 5
                                            },
                                            {
                                                "checkinClass": {
                                                    "code": "Y",
                                                    "description": "Economy"
                                                },
                                                "position": 6
                                            },
                                            {
                                                "checkinClass": {
                                                    "code": "Y",
                                                    "description": "Economy"
                                                },
                                                "position": 7
                                            },
                                            {
                                                "checkinClass": {
                                                    "code": "Y",
                                                    "description": "Economy"
                                                },
                                                "position": 8
                                            },
                                            {
                                                "checkinClass": {
                                                    "code": "Y",
                                                    "description": "Economy"
                                                },
                                                "position": 9
                                            },
                                            {
                                                "checkinClass": {
                                                    "code": "Y",
                                                    "description": "Economy"
                                                },
                                                "position": 10
                                            },
                                            {
                                                "checkinClass": {
                                                    "code": "Y",
                                                    "description": "Economy"
                                                },
                                                "position": 11
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "startTime": "2022-10-09T09:30:00.000+02:00"
                    }
                ],
                "remarks": null
            },
            "codeshares": null,
            "estimatedLandingTime": null,
            "expectedTimeBoarding": "2022-10-09T11:50:00.000+02:00",
            "expectedTimeGateClosing": "2022-10-09T12:10:00.000+02:00",
            "expectedTimeGateOpen": "2022-10-09T11:30:00.000+02:00",
            "expectedTimeOnBelt": null,
            "expectedSecurityFilter": "VF3",
            "flightDirection": "D",
            "flightName": "TK7769",
            "flightNumber": 7769,
            "gate": "D27",
            "pier": "D",
            "id": "135673034205682379",
            "isOperationalFlight": true,
            "mainFlight": "TK7769",
            "prefixIATA": "TK",
            "prefixICAO": "THY",
            "airlineCode": 166,
            "publicEstimatedOffBlockTime": null,
            "publicFlightState": {
                "flightStates": [
                    "SCH"
                ]
            },
            "route": {
                "destinations": [
                    "SAW"
                ],
                "eu": "N",
                "visa": false
            },
            "scheduleDateTime": "2022-10-09T12:30:00.000+02:00",
            "scheduleDate": "2022-10-09",
            "scheduleTime": "12:30:00",
            "serviceType": "J",
            "terminal": 3,
            "transferPositions": null,
            "schemaVersion": "4"
        }
    }
}
```

**Errors:**

| code | message                                   | note | status     |
| ---- | ----------------------------------------- | ---- | ---------- |
| 204  | No flight has been found with provided ID |      | No Content |

### Booking Requests

#### Booking a Seat for a Flight

**Method:** POST

**route:** /api/bookings/

**expected JSON body sample:**

```json
{
    "scipholid":"135673034205682379",
    "seatNumber": "12"
}
```

**Expected JSON Response sample:**

Status: **201 Created**

```json

{
    "status": "success",
    "data": {
        "booking": {
            "scipholid": "135673034205682379",
            "seatNumber": "12",
            "user": {
                "id": "457cd60e-ea9c-45c1-8f49-68f9c200d290",
                "created_at": "2022-10-08T17:54:43.341Z",
                "updated_at": "2022-10-08T17:54:58.462Z",
                "name": "Alp Eren Özalp",
                "email": "alperenoz93@hotmail.com",
                "role": "user"
            },
            "flight": {
                "id": "37132c41-e91f-4d4b-8121-20b6f0241555",
                "created_at": "2022-10-08T17:12:12.150Z",
                "updated_at": "2022-10-08T18:34:55.730Z",
                "scipholid": "135673034205682379",
                "flightName": "TK7769",
                "flightNumber": "7769",
                "flightDirection": "D",
                "scheduleDateTime": "2022-10-09T10:30:00.000Z",
                "scheduleDate": "2022-10-08T21:00:00.000Z",
                "scheduleTime": "12:30:00",
                "route": [
                    "SAW"
                ],
                "avalibleSeats": [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "13",
                    "14",
                    "15",
                    "16",
                    "17",
                    "18",
                    "19",
                    "20",
                    "21",
                    "22",
                    "23",
                    "24",
                    "25",
                    "11"
                ]
            },
            "id": "e3aedfbd-e00e-4d83-b12c-132d81b32094",
            "created_at": "2022-10-08T18:34:55.735Z",
            "updated_at": "2022-10-08T18:34:55.735Z"
        }
    }
}
```

**Errors:**

| code | message                                   | note | status  |
| ---- | ----------------------------------------- | ---- | ------- |
| 404  | No flight has been found with provided ID |      | fail    |
| 400  | Cannot book for past flights              |      | fail    |
| 400  | Cannot book for arrivals                  |      | fail    |
| 400  | Chosen seat already booked                |      | success |

#### Listing Booked Flights

**Method:** GET

**route:** /api/bookings/

**parameters:** none

**Expected JSON Response sample:**

Status: **200 OK**

```json
{
    "status": "success",
    "data": {
        "futureBookings": [
            null,
            {
                "id": "e67be349-908d-4f5a-be2d-2f360487bd20",
                "created_at": "2022-10-08T18:54:16.730Z",
                "updated_at": "2022-10-08T18:54:16.730Z",
                "scipholid": "135687083538138225",
                "seatNumber": "25",
                "flight": {
                    "id": "b414308f-f70a-43d1-a8cc-1cdad54595d2",
                    "created_at": "2022-10-08T18:54:06.713Z",
                    "updated_at": "2022-10-08T18:54:16.724Z",
                    "scipholid": "135687083538138225",
                    "flightName": "PC1256",
                    "flightNumber": "1256",
                    "flightDirection": "D",
                    "scheduleDateTime": "2022-10-11T05:20:00.000Z",
                    "scheduleDate": "2022-10-10T21:00:00.000Z",
                    "scheduleTime": "07:20:00",
                    "route": [
                        "SAW"
                    ],
                    "avalibleSeats": [
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                        "11",
                        "12",
                        "13",
                        "14",
                        "15",
                        "16",
                        "17",
                        "18",
                        "19",
                        "20",
                        "21",
                        "22",
                        "23",
                        "24"
                    ]
                }
            }
        ],
        "pastFlights": [
            {
                "id": "4c5b15f2-92fb-4f60-a0c8-f61b10596a1a",
                "created_at": "2022-10-08T18:52:38.741Z",
                "updated_at": "2022-10-08T18:52:38.741Z",
                "scipholid": "135651958743599015",
                "seatNumber": "25",
                "flight": {
                    "id": "4947c020-f415-4f18-a974-d81cd89b459d",
                    "created_at": "2022-10-08T18:52:24.400Z",
                    "updated_at": "2022-10-08T18:52:38.736Z",
                    "scipholid": "135651958743599015",
                    "flightName": "PC1256",
                    "flightNumber": "1256",
                    "flightDirection": "D",
                    "scheduleDateTime": "2022-10-06T05:20:00.000Z",
                    "scheduleDate": "2022-10-05T21:00:00.000Z",
                    "scheduleTime": "07:20:00",
                    "route": [
                        "SAW"
                    ],
                    "avalibleSeats": [
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                        "11",
                        "12",
                        "13",
                        "14",
                        "15",
                        "16",
                        "17",
                        "18",
                        "19",
                        "20",
                        "21",
                        "22",
                        "23",
                        "24"
                    ]
                }
            },
            null
        ]
    }
}
```

### Cancel Booked Flights

This request deletes the booking for the user and makes previously occupied seat available again.

 **Method:** DELETE

**route:** /api/bookings/:bookingId

**parameters:** /bookingId

**Expected Response:**

**Status:** 204 No Content

**Errors:**

| code | message                                   | note | status |
| ---- | ----------------------------------------- | ---- | ------ |
| 404  | No flight has been found with provided ID |      | fail   |
