<h1 style='background-color: rgba(55, 55, 55, 0.4); text-align: center'>Senicare API 설계(명세)서</h1>

해당 API 명세서는 '시니어케어 ERP - Senicare'의 REST API를 명세하고 있습니다.  

- Domain : <http://localhost:4000>  

***
  
<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>Auth 모듈</h2>

Senicare 서비스의 인증 및 인가와 관련된 REST API 모듈입니다.  
로그인, 회원가입, 소셜 로그인 등의 API가 포함되어 있습니다.  
Auth 모듈은 인증 없이 요청할 수 있습니다.  
  
- url : /api/v1/auth  

***

#### - 로그인  
  
##### 설명

클라이언트는 사용자 아이디와 평문의 비밀번호를 입력하여 요청하고 아이디와 비밀번호가 일치한다면 인증에 사용될 token과 해당 token의 만료 기간을 응답 데이터로 전달 받습니다. 만약 아이디 혹은 비밀번호가 하나라도 틀린다면 로그인 정보 불일치에 해당하는 응답을 받게됩니다. 네트워크 에러, 서버 에러, 데이터베이스 에러, 토큰 생성 에러가 발생할 수 있습니다.  

- method : **POST**  
- end point : **/sign-in**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| userId | String | 사용자의 아이디 | O |
| password | String | 사용자의 비밀번호 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/sign-in" \
 -d "userId=qwer1234" \
 -d "password=P!ssw0rd"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환되는 Response Body의 Content type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 코드에 대한 설명 | O |
| accessToken | String | Bearer token 인증 방식에 사용될 JWT | O |
| expiration | Integer | JWT 만료 기간 (초단위) | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success.",
  "accessToken": "${ACCESS_TOKEN}",
  "expiration": 32400
}
```

**응답 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "VF",
  "message": "Validation failed."
}
```

**응답 실패 (로그인 정보 불일치)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "SF",
  "message": "Sign in failed."
}
```

**응답 실패 (토큰 생성 실패)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "TCF",
  "message": "Token creation failed."
}
```

**응답 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "DBE",
  "message": "Database error."
}
```

***

#### - 아이디 중복 확인  
  
##### 설명

클라이언트는 사용할 아이디를 입력하여 요청하고 중복되지 않는 아이디라면 성공 응답을 받습니다. 만약 아이디가 중복된다면 아이디 중복에 해당하는 응답을 받게됩니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **POST**  
- end point : **/id-check**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| userId | String | 중복확인 할 사용자의 아이디 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/id-check" \
 -d "userId=qwer1234"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환되는 Response Body의 Content type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 코드에 대한 설명 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success."
}
```

**응답 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "VF",
  "message": "Validation failed."
}
```

**응답 : 실패 (중복된 아이디)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "DI",
  "message": "Duplicated user id."
}
```

**응답 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "DBE",
  "message": "Database error."
}
```

***

#### - 전화번호 인증  
  
##### 설명

클라이언트는 숫자로만 이루어진 11자리 전화번호를 입력하여 요청하고 이미 사용중인 전화번호인지 확인 후 4자리의 인증번호를 해당 전화번호에 문자를 전송합니다. 인증번호가 정상적으로 전송이 된다면 성공 응답을 받습니다. 만약 중복된 전화번호를 입력한다면 중복된 전화번호에 해당하는 응답을 받게됩니다. 네트워크 에러, 서버 에러, 데이터베이스 에러, 문자 전송 실패가 발생할 수 있습니다.  

- method : **POST**  
- URL : **/tel-auth**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| telNumber | String | 인증 번호를 전송할 사용자의 전화번호 (11자리 숫자) | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/tel-auth" \
 -d "telNumber=01011112222"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환되는 Response Body의 Content type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 코드에 대한 설명 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success."
}
```

**응답 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "VF",
  "message": "Validation failed."
}
```

**응답 : 실패 (중복된 전화번호)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "DT",
  "message": "Duplicated user tel number."
}
```

**응답 실패 (인증번호 전송 실패)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "TF",
  "message": "Auth number send failed."
}
```

**응답 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "DBE",
  "message": "Database error."
}
```

***

#### - 인증번호 확인  
  
##### 설명

클라이언트는 사용자 전화번호와 인증번호를 입력하여 요청하고 해당하는 전화번호와 인증번호가 서로 일치하는지 확인합니다. 일치한다면 성공에 대한 응답을 받습니다. 만약 일치하지 않는 다면 전화번호 인증 실패에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **POST**  
- end point : **/tel-auth-check**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| telNumber | String | 인증 번호를 확인할 사용자 전화번호 | O |
| authNumber | String | 인증 확인에 사용할 인증 번호 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/tel-auth-check" \
 -d "telNumber=01011112222" \
 -d "authNumber=1234"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환되는 Response Body의 Content type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 코드에 대한 설명 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success."
}
```

**응답 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "VF",
  "message": "Validation failed."
}
```

**응답 : 실패 (전화번호 인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "TAF",
  "message": "Tel number authentication failed."
}
```

**응답 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "DBE",
  "message": "Database error."
}
```

***

#### - 회원가입  
  
##### 설명

클라이언트는 사용자 이름, 사용자 아이디, 비밀번호, 전화번호, 인증번호, 가입경로를 입력하여 요청하고 회원가입이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하는 아이디일 경우 중복된 아이디에 대한 응답을 받고, 만약 존재하는 전화번호일 경우 중복된 전화번호에 대한 응답을 받고, 전화번호와 인증번호가 일치하지 않으면 전화번호 인증 실패에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **POST**  
- end point : **/sign-up**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| name | String | 사용자의 이름 | O |
| userId | String | 사용자의 아이디 | O |
| password | String | 사용자의 비밀번호 (8~13자의 영문 + 숫자) | O |
| telNumber | String | 사용자의 전화번호 (11자의 숫자) | O |
| authNumber | String | 전화번호 인증번호 | O |
| joinPath | String | 회원가입 경로 (기본: 'HOME', 카카오: 'KAKAO', 네이버: 'NAVER') | O |
| snsId | String | SNS 가입시 sns oauth2 ID | X |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/sign-up" \
 -d "name=홍길동"\
 -d "userId=qwer1234"\
 -d "password=qwer1234"\
 -d "telNumber=01011112222"\
 -d "authNumber=1234"\
 -d "joinPath=HOME"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환되는 Response Body의 Content type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 코드에 대한 설명 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success."
}
```

**응답 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "VF",
  "message": "Validation failed."
}
```

**응답 : 실패 (중복된 아이디)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "DI",
  "message": "Duplicated user id."
}
```

**응답 : 실패 (중복된 전화번호)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "DT",
  "message": "Duplicated user tel number."
}
```

**응답 : 실패 (전화번호 인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "TAF",
  "message": "Tel number authentication failed."
}
```

**응답 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "DBE",
  "message": "Database error."
}
```

***

#### - SNS 회원가입 및 로그인  
  
##### 설명

클라이언트는 OAuth 인증서버를 입력하여 요청하고 해당하는 Redirect 응답을 받습니다. 회원가입이 되어있는 사용자의 경우 쿼리 매개변수로 접근 토큰과 토큰 만료 기간을 반환하며 회원가입이 되어있지 않은 사용자의 경우 쿼리 매개변수로 sns 아이디와 해당하는 sns 서비스의 이름을 반환합니다. 

- method : **GET**  
- end point : **/sns-sign-in/{registerId}**  

##### Request

###### Path Variable

| name | type | description | required |
|---|:---:|:---:|:---:|
| registerId | String | 사용 SNS (카카오: 'kakao', 네이버: 'naver') | O |

###### Example

```bash
curl -X POST "http://localhost:4000/api/v1/auth/sns-sign-in/{kakao}" 
```

##### Response

###### Example

**응답 성공 (회원 O)**
```bash
HTTP/1.1 302 Found 
Location: http://localhost:3000/sns-success?accessToken=${accessToken}&expiration=36000
```

**응답 성공 (회원 X)**
```bash
HTTP/1.1 302 Found 
Location: http://localhost:3000/auth?snsId=${snsId}&joinPath=${joinPath}
```

***

<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>Nurse 모듈</h2>

Senicare 서비스의 요양사와 관련된 REST API 모듈입니다.  
요양사 정보확인, 로그인 요양사 정보 확인, 요양사 정보 수정 등의 API가 포함되어 있습니다.  
Nurse 모듈은 모두 인증이 필요합니다.  
  
- url : /api/v1/nurse  

***

#### - 로그인 유저 정보 확인
  
##### 설명

클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함하여 요청하고 회원가입이 성공적으로 이루어지면 성공에 대한 응답으로 토큰에 해당하는 요양사의 아이디와 이름, 전화번호를 응답 받습니다. 만약 존재하지 않는 아이디일 경우 존재하지 않는 아이디에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 인증 실패, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **GET**  
- URL : **/**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Example

```bash
curl -X GET "http://localhost:4000/api/v1/nurse" 
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환되는 Response Body의 Content type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 코드에 대한 설명 | O |
| userId | String | 요양사 아이디 | O |
| name | String | 요양사 이름 | O |
| telNumber | String | 요양사 전화번호 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success.",
  "userId": "qwer1234",
  "name": "홍길동",
  "telNumber": "01012345678"
}
```

**응답 : 실패 (존재하지 않는 아이디)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NI",
  "message": "No exist user id."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "AF",
  "message": "Authentication fail."
}
```

**응답 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "DBE",
  "message": "Database error."
}
```

***
  
<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>Tool 모듈</h2>

Senicare 서비스의 용품과 관련된 REST API 모듈입니다.  
용품 등록, 용품 리스트 보기, 용품 정보 보기, 용품 정보 수정, 용품 수정 등의 API가 포함되어 있습니다.  
Tool 모듈은 모두 인증이 필요합니다.  
  
- url : /api/v1/tool  

***

#### - 용품 등록  
  
##### 설명

클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함하고 용품 이름, 용품 목적, 개수를 입력하여 요청하고용품 등록이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 인증 실패, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **POST**  
- end point : **/**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| name | String | 용품 이름 | O |
| purpose | String | 용품 목적 | O |
| count | Integer | 용품 개수 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/tool" \
 -d "name=휠체어" \
 -d "purpose=거동이 불편하신 분들을 위한 휠체어" \
 -d "count=1"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환되는 Response Body의 Content type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 코드에 대한 설명 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success."
}
```

**응답 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "VF",
  "message": "Validation failed."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "AF",
  "message": "Authentication fail."
}
```

**응답 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "DBE",
  "message": "Database error."
}
```

***

#### - 용품 리스트 보기
  
##### 설명

클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함하여 요청하고 조회가 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 인증 실패, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **GET**  
- URL : **/**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Example

```bash
curl -X GET "http://localhost:4000/api/v1/tool" 
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환되는 Response Body의 Content type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 코드에 대한 설명 | O |
| tools | Tool | 용품 리스트 | O |
  
**Tool**  
| name | type | description | required |
|---|:---:|:---:|:---:|
| toolNumber | Integer | 용품 번호 | O |
| name | String | 용품 이름 | O |
| purpose | String | 용품 용도 | O |
| count | Integer | 개수 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success.",
  "tools": [
    {
      "toolNumber": 1,
      "name": "휠체어",
      "purpose": "거동이 불편하신 분들을 위한 휠체어",
      "count": 1
    },
    ...
  ]
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "AF",
  "message": "Authentication fail."
}
```

**응답 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "DBE",
  "message": "Database error."
}
```

***

#### - 용품 정보 보기
  
##### 설명

클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함하고 URL에 용품번호를 포함하여 요청하고 조회가 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 용품일 경우 존재하지 않는 용품에 해당하는 응답을 받습니다. 네트워크 에러, 서버 에러, 인증 실패, 데이터베이스 에러가 발생할 수 있습니다. 

- method : **GET**  
- URL : **/{toolNumber}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Example

```bash
curl -X GET "http://localhost:4000/api/v1/tool/1" 
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환되는 Response Body의 Content type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 코드에 대한 설명 | O |
| toolNumber | Integer | 용품 번호 | O |
| name | String | 용품 이름 | O |
| purpose | String | 용품 용도 | O |
| count | Integer | 개수 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success.",
  "toolNumber": 1,
  "name": "휠체어",
  "purpose": "거동이 불편하신 분들을 위한 휠체어",
  "count": 1
}
```

**응답 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "VF",
  "message": "Validation failed."
}
```

**응답 : 실패 (존재하지 않는 용품)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NT",
  "message": "No exist tool."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "AF",
  "message": "Authentication fail."
}
```

**응답 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "DBE",
  "message": "Database error."
}
```

***

#### - 용품 수정  
  
##### 설명

클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함하고 URL에 용품번호를 포함하고 용품 이름, 용품 목적, 개수를 입력하여 요청하고 용품 수정이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 용품일 경우 존재하지 않는 용품에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 인증 실패, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **PATCH**  
- end point : **/{toolNumber}**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| name | String | 용품 이름 | O |
| purpose | String | 용품 목적 | O |
| count | Integer | 용품 개수 | O |

###### Example

```bash
curl -v -X PATCH "http://localhost:4000/api/v1/tool" \
 -d "name=휠체어 대형" \
 -d "purpose=거동이 불편하신 분들을 위한 휠체어" \
 -d "count=5"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환되는 Response Body의 Content type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 코드에 대한 설명 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success."
}
```

**응답 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "VF",
  "message": "Validation failed."
}
```

**응답 : 실패 (존재하지 않는 용품)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NT",
  "message": "No exist tool."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "AF",
  "message": "Authentication fail."
}
```

**응답 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "DBE",
  "message": "Database error."
}
```

***

#### - 용품 삭제  
  
##### 설명

클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함하고 URL에 용품번호를 포함하여 요청하고 용품 삭제가 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 용품일 경우 존재하지 않는 용품에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 인증 실패, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **DELETE**  
- end point : **/{toolNumber}**  

##### Request

###### Example

```bash
curl -v -X DELETE "http://localhost:4000/api/v1/tool/1" \
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환되는 Response Body의 Content type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 코드에 대한 설명 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success."
}
```

**응답 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "VF",
  "message": "Validation failed."
}
```

**응답 : 실패 (존재하지 않는 용품)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NT",
  "message": "No exist tool."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "AF",
  "message": "Authentication fail."
}
```

**응답 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "DBE",
  "message": "Database error."
}
```