# EnjoyTrip 프런트엔드 작업 시작 템플릿

기능 구현 없이 페이지와 작업 환경만 준비한 분업용 템플릿입니다.
HTML5 + CSS3 + Vanilla JavaScript + Bootstrap 5.3.3 사용. 프레임워크, 빌드 도구, 백엔드 없음.
조회/가입/로그인/수정/탈퇴/비밀번호 찾기 기능은 전부 미구현이며 버튼은 disabled 상태입니다.

## 실행

1. ZIP을 압축 해제하고 VS Code에서 enjoytrip-sample 폴더를 엽니다.
2. Live Server 확장으로 index.html을 실행합니다.
3. 또는 이 폴더에서 `python -m http.server 5500` 실행 후 http://localhost:5500 접속.
4. Bootstrap CDN 로드를 위해 인터넷 연결 필요.

Git으로 받은 경우 `js/config.example.js`를 `js/config.js`로 복사하세요.
ZIP에는 빈 키의 config.js도 포함되어 있어 바로 페이지 확인이 가능합니다.

## 페이지별 파일과 분업

| 작업 | HTML | JavaScript | 필수 요구사항 |
| --- | --- | --- | --- |
| 메인 화면 | index.html | js/index.js | 공통 진입 화면 |
| 관광지 조회 | attractions.html | js/attractions.js | F101/F102/F103 |
| 회원가입 | signup.html | js/signup.js | F107 |
| 로그인 | login.html | js/login.js | F108 |
| 회원 조회·수정·탈퇴 | profile.html | js/profile.js | F107 |
| 비밀번호 찾기 | password.html | js/password.js | F108 |
| 공통 환경 | 각 페이지 내비게이션 | js/common.js, js/config.js | 로그인 상태·로그아웃 |
| 공통 스타일 | - | css/style.css | Bootstrap 반응형 UI |

2명이라면 관광지 담당 / 회원 담당으로 나누고 공통 파일은 함께 협의합니다.
내비게이션은 각 HTML에 동일하게 넣었습니다. 메뉴 수정 시 모든 페이지를 맞춰 주세요.
공통 회원 데이터 형식과 저장 키를 먼저 합의하면 충돌을 줄일 수 있습니다.

## 구현해야 할 필수 사항 (현재 전부 미구현)

- F101: 한국관광공사 지역별 관광정보 수집 및 표시.
- F102: 지역별 관광지·숙박·음식점 조회.
- F103: 지역별 문화시설·공연·여행코스·쇼핑 조회.
- F107: 회원가입·정보 조회·수정·탈퇴.
- F108: 로그인·로그아웃·비밀번호 찾기.
- 폼 유효성 검사, 동적 DOM 조작, localStorage CRUD, 모달 연결.
- 모바일 반응형 화면, 입력 라벨, 로딩/오류/빈 결과 안내.

관광 유형 선택지만 준비했습니다. 지역 목록과 관광지 데이터는 담당자가 연결하세요.
명세서 작업 순서에는 더미 데이터와 localStorage 활용이 제시되어 있습니다.
더미 데이터로 개발할 경우 실제 공공데이터 조회가 완료된 것으로 표시하지 마세요.

## API 및 지도

명세서 준비사항에는 한국관광공사 국문관광정보 서비스_GW와 SGIS 오픈 API가 있습니다.
본 템플릿은 API/지도 SDK를 로드하지 않고 설정 위치와 지도 영역만 제공합니다.
카카오 지도는 앞서 논의한 선택 연동용 설정만 포함했습니다. SGIS 구현을 대체했다고 간주하지 않습니다.
수업에서 SGIS 사용을 요구하는 경우 SGIS를 연결하세요.

- 한국관광공사: https://www.data.go.kr/data/15101578/openapi.do
- SGIS: https://sgis.kostat.go.kr/developer/html/main.html
- 카카오 지도 가이드: https://apis.map.kakao.com/web/guide/
- 카카오 지도 사용 시 JavaScript 키 및 실제 실행 도메인 등록 필요.
- 회원 기능을 localStorage로 시연할 경우 실제 서버 인증·이메일 발송과 구분해 설명하세요.

## 팀이 작성할 요구사항 및 제출물

- 본 템플릿 표를 기반으로 요구사항 기능 명세서와 역할 분담을 작성.
- README에 팀원, 구현 기능, 실행 방법, 데이터 출처, AI 활용 내용을 추가.
- 구현 소스코드 및 실행 화면 캡처본을 제출.
- GitLab 업로드 및 반별 제출 방식 확인.

여행 계획(F104), Hot Place(F105), 뉴스(F106), 공지사항(F109), 게시판(F110)은
선택 기능이므로 이번 페이지 틀에서 제외했습니다.
