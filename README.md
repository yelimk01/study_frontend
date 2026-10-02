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
# Frontend Kimhyunjun Kangyelim



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

* [Create](https://docs.gitlab.com/user/project/repository/web_editor/#create-a-file) or [upload](https://docs.gitlab.com/user/project/repository/web_editor/#upload-a-file) files
* [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://lab.ssafy.com/s16/a10/02.mini-projects/03.frontend/frontend_kimhyunjun_kangyelim.git
git branch -M master
git push -uf origin master
```

## Integrate with your tools

* [Set up project integrations](https://lab.ssafy.com/s16/a10/02.mini-projects/03.frontend/frontend_kimhyunjun_kangyelim/-/settings/integrations)

## Collaborate with your team

* [Invite team members and collaborators](https://docs.gitlab.com/user/project/members/)
* [Create a new merge request](https://docs.gitlab.com/user/project/merge_requests/creating_merge_requests/)
* [Automatically close issues from merge requests](https://docs.gitlab.com/user/project/issues/managing_issues/#closing-issues-automatically)
* [Enable merge request approvals](https://docs.gitlab.com/user/project/merge_requests/approvals/)
* [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

* [Get started with GitLab CI/CD](https://docs.gitlab.com/ci/quick_start/)
* [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/user/application_security/sast/)
* [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/topics/autodevops/requirements/)
* [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/user/clusters/agent/)
* [Set up protected environments](https://docs.gitlab.com/ci/environments/protected_environments/)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
