# API 기능 세부
  
## - Auth
  
### 로그인 (sign-in) 
  
- 클라이언트로부터 요청 (request body에 데이터가 포함되어 있음)  
  
1. request body의 데이터에 대해서 유효성 확인  
1.1 만약 유효하지 않은 데이터이면 'VF' 응답 처리  
  
(userId, password)  
  
2. 데이터베이스의 user 테이블에서 userId에 해당하는 유저 레코드 조회  
2.1 만약 유저 레코드가 존재하지 않으면 'SF' 응답 처리  
2.2 만약 데이터베이스 작업 중 에러가 발생하면 'DBE' 응답 처리  
  
3. 조회한 레코드의 암호화된 비밀번호와 사용자가 입력한 평문의 비밀번호가 일치하는지 비교
3.1 만약 비밀번호가 서로 일치하지 않으면 'SF' 응답 처리

4. JWT로된 accessToken 생성
4.1 만약 accessToken 생성 중 에러가 발생하면 'TF' 응답 처리

5. 'SU' 응답 처리 (accessToken, expires 데이터가 포함되어있음)  

### 아이디 중복 확인 (id-check) 

- 클라이언트로부터 요청 (request body에 데이터가 포함되어 있음)  
  
1. request body의 데이터가 유효한 데이터인지 확인  
1.1 만약 유효하지 않은 데이터이면 'VF' 응답 처리  
  
- (userId)  
  
2. 데이터베이스의 user 테이블에서 해당하는 userId를 가지고 있는 유저가 있는지 확인  
2.1 만약 가지고 있는 유저가 존재하면 'DI' 응답 처리  
2.2 만약 데이터베이스 작업 중 에러가 발생하면 'DBE' 응답 처리  
  
3. 'SU' 응답 처리  

### 전화번호 인증 (tel-auth) 
  
- 클라이언트로부터 요청 (request body에 데이터가 포함되어 있음)  
  
1. request body의 데이터에 대해서 유효성 확인  
1.1 만약 유효하지 않은 데이터이면 'VF' 응답 처리  
  
- (telNumber)  
  
2. 데이터베이스의 user 테이블에서 해당하는 telNumber를 가지고 있는 유저가 있는지 확인  
2.1 만약 가지고 있는 유저가 존재하면 'DT' 응답 처리  
2.2 만약 데이터베이스 작업 중 에러가 발생하면 'DBE' 응답 처리  
  
3. 4자리의 인증 번호를 생성  
  
4. telNumber에 생성한 4자리의 인증 번호를 전송  
4.1 만약 이메일 전송 중에 에러가 발생하면 'TF' 응답 처리  
  
5. 데이터베이스의 tel_auth_number 테이블에 telNumber와 생성한 4자리의 인증 번호를 저장  
5.1 만약 데이터베이스 작업 중 에러가 발생하면 'DBE' 응답 처리  
  
6. 'SU' 응답 처리  

### 전화번호 인증 확인 (tel-auth-check) 
  
- 클라이언트로부터 요청 (request body에 데이터가 포함되어 있음)  
  
1. request body의 데이터에 대해서 유효성 확인  
1.1 만약 유효하지 않은 데이터이면 'VF' 응답 처리  
  
- (telNumber, authNumber)  
  
2. 데이터베이스의 tel_auth_number 테이블에서 해당하는 telNumber와 authNumber를 모두 가지고 있는 데이터가 있는지 확인  
2.1 해당하는 데이터가 없다면 'TAF' 응답 처리  
2.2 만약 데이터베이스 작업 중 에러가 발생하면 'DBE' 응답 처리  
  
3. 'SU' 응답 처리  

### 회원가입 (sign-up)

- 클라이언트로부터 요청(request body에 데이터가 포함되어 있음)

1. request body의 데이터에 대해서 유효성 확인
    1-1. 만약 유효하지 않은 데이터이면 'VF' 응답 처리

    (name, userId, password, telNumber, authNumber)

2. 데이터베이스의 user 테이블에서 userId에 해당하는 유저 레코드 조회
    2-1. 만약 존재하는 userId이면 'DI' 응답 처리
    2-2. 만약 데이터베이스 작업 중 에러가 발생하면 'DBE' 응답 처리

3. 데이터베이스의 user 테이블에서 telNumber에 해당하는 유저 레코드 조회
    3-1. 만약 존재하는 telNumber이면 'DT' 응답 처리
    3-2. 만약 데이터베이스 작업 중 에러가 발생하면 'DBE' 응답 처리

4. 데이터베이스의 tel_auth_number 테이블에서 telNumber와 authNumber를 모두 가지고 있는 레코드 조회
    4-1. 만약 존재하는 레코드가 없다면 'TAF' 응답 처라
    4-2. 만약 데이터베이스 작업 중 에러가 발생하면 'DBE' 응답 처리

5. 클라이언트로부터 입력받은 password 암호화

6. 클라이언트로부터 입력받은 name, userId, telNumber, 암호화된 password, 가입경로를 사용하여 user 테이블에 레코드 삽입
    6-1. 만약 데이터베이스 작업 중 에러가 발생하면 'DBE' 응답 처리

7. 성공 'SU' 응답 처리