# Geteam-http-api(branch: master, [link](https://github.com/woni-d/Geteam-http-api))

- Use PassportUser, Move OrderOption to Option as exported interface
- Update validateValue function's param type
- Update express, db console log
- Add type of passport deserializeUser, Fix account's UpdateIsVerified interface
- Add account, applicant interfaces, Move message interfaces to index file
- Make /ts/models directory, Fix board, team, Option, QueryString interfaces, Add Filter(boards, messages) interfaces
- Add interfaces to board model
- Remove any type, Add specific interfaces, Add @types/util.promisify to dependencies
- Use QueryString interface, Rename  AccessToken to AccessTokenPayload
- Use PassportUser interface
- Change ts interface naming convention, Remove prefix with I from ts interfaces
- Add logger(morgan)
- Fix passport, auth.controller.ts
- Fix mailing function parameters
- Fix to save _id value as ObjectId
- Change fields boards.accountId -> author, applications.accountId -> applicant
- Add kind, category constant
- Change failureResponse 'export' to 'export default'
- Fix position fields in boards collection, ts interface
- Fix end-point for preparing postman requests
- Change applies to applications
- Fix 'Date.now()' to 'new Date()', Change something about db function
- Change req!.user! to req.user
- Change end point, router
- Refactor message router, controller, db function, ts interface
- Refactor board router, controller, db function, ts interface
- Refactor auth router, controller, db function, ts interface
- Refactor apply router, controller, db function
- Add declare global(namespace Express, interface User)
- Fix functions, typescript interface
- Merge branch 'master' of https://github.com/woni-d/Geteam-http-api
- Add a prefix to endpoint, response object, Change endpoint, DB functions parameter, indentation
- Add board, team limit check logic
- Add index router, Fix indentation(2), db connection option
- Add createdAt, updatedAt logic in db function
- Fix models function
- Add CheckIsDuplicatedEmail, CheckIsDuplicatedSnum
- Fix to run start script
- Fix router using passport jwt
- Add message router,controller, passport jwt in router
- Fix passport jwt strategy to use
- Add controller
- Fix Apply GetList return form so that { list, count }
- Fix rest of auth end-point, db function
- Fix signup, signin, signout
- Add  INVALID_PARAM, NOT_FOUND, BAD_REQUEST in failureResponse
- Remove mypage router
- Fix board post, patch, delete end-point, db function
- Fix board get end-point, db function
- Fix apply post, patch, delete end-point, db function
- Fix apply get end-point, db function
- Fix ts interface
- Fix api response form
- Add interface using new db schema
- Fix to export model names
- Remove mongoose (without connection)
- Remove semicolon
- Merge pull request #6 from kyw017763/dependabot/npm_and_yarn/minimist-1.2.5  Bump minimist from 1.2.0 to 1.2.5
- Add AWS ElastiCache, SES
- Fix board view when there's not apply, Add AWS DocumentDB
- Add email template
- Add teamChk email, db logic
- Fix to get, patch mypage
- Merge branch 'master' of https://github.com/kyw017763/Geteam-rest-api
- Add 'new: true' option to all findByIdAndUpdate()
- Remove useless .catch()
- Add '/boards', '/applies', '/info', '/pwd', '/noti' in mypage router
- Remove useless .catch()
- Fix redis promise in Number(), Use listCnt, applyCnt
- Add validate(kind, category, order) library
- Remove duplicated code in board, apply router
- Add document count to list response, Fix apply api, Remove useless fields in apply schema
- Add /register/compareEmail, Add id to payload in JWT
- Add promise in class RedisClient, Fix address in email
- Remove unnecessary then, catch, Fix isAccepted
- Add enableModify, enableApply,  isApplied, isAccepted in board router
- Remove unused statics method in mongoose schema
- Add class RedisClient to gather logic, Remove db checking in '/verify'
- Merge pull request #5 from kyw017763/feat/apply  Feat/apply
- Merge pull request #4 from kyw017763/feat/auth  Add verify end-point, Fix end-point(unregister)
- Merge branch 'master' into feat/auth
- Fix apply router to work
- Add study logic in apply router, Fix apply schema's fields
- Fix 'throw new err' to 'throw new Error(err)'
- Fix board router path to remove category params
- Fix conflict
- Merge pull request #3 from kyw017763/feat/board  Feat/board
- Fix router path, Add listNum,order,limit, Remove auto-increment
- Add endDay condition, populate to board router, Fix schema name, interface to populate
- Add verify that jwt's owner&request's owner are the same using passport-jwt
- Add contest logic, pagination, hit in board router, Fix part field(contest)
- Add status code 204 to res, Fix snake case to cammel case in board router
- Add study logic in board router, Change member to account
- Merge pull request #2 from kyw017763/feat/counting  Feat/counting
- Use visit, member counting increase function
- Add enum to kind field
- Add verify end-point, Fix end-point(unregister)
- Add visit,member,list,apply,team counting to redis
- Merge pull request #1 from kyw017763/feat/auth  Feat/auth
- Add status code to res in auth router, Fix account verify key (exclude '/')
- Add jwt logic in auth router
- Fix auth email logic in auth router(change post to get)
- Fix mongodb connection
- Add ref to schema, schema's interface
- Add schema's interface
- Add /signup/email
- Add mongoose schema, connection
- Initial commit

<hr>

- Use PassportUser, Move OrderOption to Option as exported interface *(2021.02.22 14:54:49, [link](https://github.com/woni-d/Geteam-http-api/commit/143ae158ee76da0ea5cdc510aae40ba33be5c541))*

- Update validateValue function's param type *(2021.02.22 14:38:44, [link](https://github.com/woni-d/Geteam-http-api/commit/18a0488153c7f2a9a36a820a322f7b193df23107))*

- Update express, db console log *(2021.02.22 14:28:26, [link](https://github.com/woni-d/Geteam-http-api/commit/4c0b03c72c4bb80f5d71a39eee5baa8c40d49eb8))*

- Add type of passport deserializeUser, Fix account's UpdateIsVerified interface *(2021.02.22 14:14:59, [link](https://github.com/woni-d/Geteam-http-api/commit/035f866fa6ea62ffde736f4ce0cf4e36e5157341))*

- Add account, applicant interfaces, Move message interfaces to index file *(2021.02.22 13:44:29, [link](https://github.com/woni-d/Geteam-http-api/commit/ece2bc06a9e4e800cfa9af92f36167c0c4f2f2c5))*

- Make /ts/models directory, Fix board, team, Option, QueryString interfaces, Add Filter(boards, messages) interfaces *(2021.02.22 13:39:53, [link](https://github.com/woni-d/Geteam-http-api/commit/aed2eb112d43e174a863cbeb01933ce38daf48bc))*

- Add interfaces to board model *(2021.02.21 06:55:17, [link](https://github.com/woni-d/Geteam-http-api/commit/683fe4c5244ad18a13c0f99da26208058bfaba43))*

- Remove any type, Add specific interfaces, Add @types/util.promisify to dependencies *(2021.02.21 06:54:58, [link](https://github.com/woni-d/Geteam-http-api/commit/439429a0168d517bea6708b012b27c04c913cc50))*

- Use QueryString interface, Rename  AccessToken to AccessTokenPayload *(2021.02.21 04:22:40, [link](https://github.com/woni-d/Geteam-http-api/commit/d032f665cf81851624e6bb67e2f92703e73f64af))*

- Use PassportUser interface *(2021.02.21 01:05:04, [link](https://github.com/woni-d/Geteam-http-api/commit/38eb118246bdce2a11d9a99fa0fb00571ed901f5))*

- Change ts interface naming convention, Remove prefix with I from ts interfaces *(2021.02.21 00:57:38, [link](https://github.com/woni-d/Geteam-http-api/commit/8aa51b3ac675cb1d9304657bee97c2b05704ceb5))*

- Add logger(morgan) *(2021.02.04 14:39:58, [link](https://github.com/woni-d/Geteam-http-api/commit/03031921cea53f73bfb4edc2f050bb6b3aa3aa64))*

- Fix passport, auth.controller.ts *(2021.02.03 12:35:02, [link](https://github.com/woni-d/Geteam-http-api/commit/632c1ecfe97fc5e54e2a287eacd09b0744562993))*

- Fix mailing function parameters *(2021.02.02 14:28:19, [link](https://github.com/woni-d/Geteam-http-api/commit/c0139d7e5928d84fa4a8cf1f4d97616bce6c4899))*

- Fix to save _id value as ObjectId *(2021.02.02 14:20:59, [link](https://github.com/woni-d/Geteam-http-api/commit/fc25c36dbc99c1e78a32721bffd96035102cb58a))*

- Change fields boards.accountId -> author, applications.accountId -> applicant *(2021.02.02 13:48:49, [link](https://github.com/woni-d/Geteam-http-api/commit/e420697051ed704ed0fa2fc9948a0bced24398c8))*

- Add kind, category constant *(2021.02.02 00:00:13, [link](https://github.com/woni-d/Geteam-http-api/commit/5da806a25dade691863fbeaffdffb60de2722c52))*

- Change failureResponse 'export' to 'export default' *(2021.02.01 23:38:25, [link](https://github.com/woni-d/Geteam-http-api/commit/2b01c4e167d5e526fb34be4e7a3ac03a474a9337))*

- Fix position fields in boards collection, ts interface *(2021.02.01 23:21:26, [link](https://github.com/woni-d/Geteam-http-api/commit/286a894a0bf64e9f6032066650e80e8df102fd12))*

- Fix end-point for preparing postman requests *(2021.02.01 13:39:53, [link](https://github.com/woni-d/Geteam-http-api/commit/d1cef35657fbb01bcaec1faed2a18be67dafe9f7))*

- Change applies to applications *(2021.02.01 13:09:06, [link](https://github.com/woni-d/Geteam-http-api/commit/91a08b3e361393280534b788f888b8eed2acf73b))*

- Fix 'Date.now()' to 'new Date()', Change something about db function *(2021.01.25 14:57:54, [link](https://github.com/woni-d/Geteam-http-api/commit/e2192afb22b847c2e079328bc7d9d8f6be580da4))*

- Change req!.user! to req.user *(2021.01.25 14:55:59, [link](https://github.com/woni-d/Geteam-http-api/commit/759551c1be3d72b9b626651f469736f9c837cae7))*

- Change end point, router *(2021.01.24 14:59:24, [link](https://github.com/woni-d/Geteam-http-api/commit/8d3292a65828784ca19df2f7198e425a676bf2cf))*

- Refactor message router, controller, db function, ts interface *(2021.01.23 14:52:21, [link](https://github.com/woni-d/Geteam-http-api/commit/e1fe8d308dc1358cadd3b0fee52f316151ed28e2))*

- Refactor board router, controller, db function, ts interface *(2021.01.20 22:55:36, [link](https://github.com/woni-d/Geteam-http-api/commit/1c4ef984699e2b82bcbad436b9309a4ae6a93c5e))*

- Refactor auth router, controller, db function, ts interface *(2021.01.20 14:41:08, [link](https://github.com/woni-d/Geteam-http-api/commit/cf770cc2972ac546a3ff56dcec044cb268c1483e))*

- Refactor apply router, controller, db function *(2021.01.16 16:48:42, [link](https://github.com/woni-d/Geteam-http-api/commit/46c44557277c6951f8c9d9ab1b4c26a7ae8f8331))*

- Add declare global(namespace Express, interface User) *(2021.01.16 16:43:06, [link](https://github.com/woni-d/Geteam-http-api/commit/ad9d2e67a915e01b8f9f53b37c3026fc6e52d0aa))*

- Fix functions, typescript interface *(2021.01.16 14:44:01, [link](https://github.com/woni-d/Geteam-http-api/commit/1cdada0abb8be0bc481ac5ee0acfbe9510cdd0c7))*

- Merge branch 'master' of https://github.com/woni-d/Geteam-http-api *(2021.01.13 23:41:02, [link](https://github.com/woni-d/Geteam-http-api/commit/bc80a87d180bae535707169370e06a1d17642d35))*

- Add a prefix to endpoint, response object, Change endpoint, DB functions parameter, indentation *(2021.01.13 23:40:07, [link](https://github.com/woni-d/Geteam-http-api/commit/e4828e59bec45fab5dee473a2b1aeb369764ca3e))*

- Add board, team limit check logic *(2020.09.19 14:25:20, [link](https://github.com/woni-d/Geteam-http-api/commit/c115cc4baa0b4170702c347d5d492a63c75ffd59))*

- Add index router, Fix indentation(2), db connection option *(2020.09.19 13:50:42, [link](https://github.com/woni-d/Geteam-http-api/commit/7faae3c6af1bb5d84bb27f25b15f19476934dd42))*

- Add createdAt, updatedAt logic in db function *(2020.09.17 14:53:39, [link](https://github.com/woni-d/Geteam-http-api/commit/7d7f16ec3a624ebca6bd41a9476dc86c93c0bb8a))*

- Fix models function *(2020.09.15 16:21:02, [link](https://github.com/woni-d/Geteam-http-api/commit/a288f9a23a21f0e030421beff72fc087cc7fb2fb))*

- Add CheckIsDuplicatedEmail, CheckIsDuplicatedSnum *(2020.09.15 14:55:40, [link](https://github.com/woni-d/Geteam-http-api/commit/c7b167fab2250bc3a6089b400445877221735f9a))*

- Fix to run start script *(2020.09.05 16:56:40, [link](https://github.com/woni-d/Geteam-http-api/commit/4a25b57fd1c74ee787ebb01090976b8a8acbbd6d))*

- Fix router using passport jwt *(2020.08.29 18:48:31, [link](https://github.com/woni-d/Geteam-http-api/commit/82a90664d54673b774d0e775867e6c2eeca25a15))*

- Add message router,controller, passport jwt in router *(2020.08.29 18:42:02, [link](https://github.com/woni-d/Geteam-http-api/commit/45b851320732d736dcee69bddef8631fbe08ae7f))*

- Fix passport jwt strategy to use *(2020.08.29 18:12:16, [link](https://github.com/woni-d/Geteam-http-api/commit/bbcdd189abd83a2acb7ebeff103aa56317dda298))*

- Add controller *(2020.08.29 15:13:28, [link](https://github.com/woni-d/Geteam-http-api/commit/404f9ada42994580eb8326ae7b5db77a6b0d3f70))*

- Fix Apply GetList return form so that { list, count } *(2020.08.18 21:43:57, [link](https://github.com/woni-d/Geteam-http-api/commit/e8587cb5bdc5e6a14ca48fef02f71790172c9db7))*

- Fix rest of auth end-point, db function *(2020.08.17 12:50:26, [link](https://github.com/woni-d/Geteam-http-api/commit/3eacbc7609618b43c0c350eb6c7c81334decaf53))*

- Fix signup, signin, signout *(2020.08.16 20:52:34, [link](https://github.com/woni-d/Geteam-http-api/commit/78ba319dc44dc8412ea687b02396b1e1771bfc8f))*

- Add  INVALID_PARAM, NOT_FOUND, BAD_REQUEST in failureResponse *(2020.08.16 19:47:44, [link](https://github.com/woni-d/Geteam-http-api/commit/213421b337434db899d8335dcb56f3eddd1044c3))*

- Remove mypage router *(2020.08.16 19:01:36, [link](https://github.com/woni-d/Geteam-http-api/commit/3fcfc75498557a1b1371c6edd99b0d0d1373756f))*

- Fix board post, patch, delete end-point, db function *(2020.08.16 18:35:04, [link](https://github.com/woni-d/Geteam-http-api/commit/820d1d54146cd8426399818183ba7e4a9b49ea42))*

- Fix board get end-point, db function *(2020.08.16 16:53:05, [link](https://github.com/woni-d/Geteam-http-api/commit/6c4fff540a30723f08b886df15e0ddcbba44ab5b))*

- Fix apply post, patch, delete end-point, db function *(2020.08.16 16:02:40, [link](https://github.com/woni-d/Geteam-http-api/commit/a3fa3d7ac900db71390b842443e1221623584b6f))*

- Fix apply get end-point, db function *(2020.08.16 14:33:45, [link](https://github.com/woni-d/Geteam-http-api/commit/14933436b48a8037d9cd0cf4df471da7ac689b4b))*

- Fix ts interface *(2020.08.16 13:16:10, [link](https://github.com/woni-d/Geteam-http-api/commit/529cf3bb6348c0a424229e548f956b01b2a23e43))*

- Fix api response form *(2020.08.16 13:13:31, [link](https://github.com/woni-d/Geteam-http-api/commit/de191d8ab88b065f7aa2d5f66aa6b84509eac3e5))*

- Add interface using new db schema *(2020.08.15 16:01:08, [link](https://github.com/woni-d/Geteam-http-api/commit/717774c41a3c8eaad3ffea7a41d0e78a57e88a7b))*

- Fix to export model names *(2020.08.15 14:32:16, [link](https://github.com/woni-d/Geteam-http-api/commit/bd2a249a673b3db6f4fc13a24d7c8639df761631))*

- Remove mongoose (without connection) *(2020.08.13 19:12:27, [link](https://github.com/woni-d/Geteam-http-api/commit/db49830800915f3321efa35a00b8ee6c99ae783c))*

- Remove semicolon *(2020.08.13 19:11:15, [link](https://github.com/woni-d/Geteam-http-api/commit/f754acb3daa33041bbb1788d6051ab6cc9a15530))*

- Merge pull request #6 from kyw017763/dependabot/npm_and_yarn/minimist-1.2.5  Bump minimist from 1.2.0 to 1.2.5 *(2020.04.06 02:16:38, [link](https://github.com/woni-d/Geteam-http-api/commit/7b2775b451902809798e0b2e946f2dec8df7302e))*

- Add AWS ElastiCache, SES *(2020.03.14 12:22:19, [link](https://github.com/woni-d/Geteam-http-api/commit/1699840bd5f464562ecdd9082713beb440efa1c6))*

- Fix board view when there's not apply, Add AWS DocumentDB *(2020.03.13 14:42:31, [link](https://github.com/woni-d/Geteam-http-api/commit/bc7b53efb0684365b56c0437a2dd75689b21ff8d))*

- Add email template *(2020.03.12 12:14:42, [link](https://github.com/woni-d/Geteam-http-api/commit/1fdcfdb012992c81206561322710e0778e714be9))*

- Add teamChk email, db logic *(2020.03.09 14:19:57, [link](https://github.com/woni-d/Geteam-http-api/commit/63154ad9e0d6abf6dd3a066dcbe1b139c228509d))*

- Fix to get, patch mypage *(2020.03.08 12:50:10, [link](https://github.com/woni-d/Geteam-http-api/commit/364ef1501ce61f2c3f1022828c30e5cbc7b48644))*

- Merge branch 'master' of https://github.com/kyw017763/Geteam-rest-api *(2020.03.06 14:54:05, [link](https://github.com/woni-d/Geteam-http-api/commit/ab04f43ff9128089d057df318cf1d3cd44c8e1e8))*

- Add 'new: true' option to all findByIdAndUpdate() *(2020.03.06 14:45:54, [link](https://github.com/woni-d/Geteam-http-api/commit/d033a887d0ffe3a1f78b5b0b6b33cf490c62aa83))*

- Remove useless .catch() *(2020.03.03 14:41:53, [link](https://github.com/woni-d/Geteam-http-api/commit/3c9959e69815acb28a462765da9c0e83bac88652))*

- Add '/boards', '/applies', '/info', '/pwd', '/noti' in mypage router *(2020.03.03 14:34:11, [link](https://github.com/woni-d/Geteam-http-api/commit/afdb21e8032102445c0589ea90fa0b0b42c81009))*

- Remove useless .catch() *(2020.03.03 14:41:53, [link](https://github.com/woni-d/Geteam-http-api/commit/f26bf4001651c8d0d90711a91a0dbe998b55fd91))*

- Fix redis promise in Number(), Use listCnt, applyCnt *(2020.03.03 12:35:35, [link](https://github.com/woni-d/Geteam-http-api/commit/047fdb2c0228047a19e23de8c1709646359e1e89))*

- Add validate(kind, category, order) library *(2020.03.03 12:09:19, [link](https://github.com/woni-d/Geteam-http-api/commit/557cac3bf6030f08ba76c956f454fd7f86076249))*

- Remove duplicated code in board, apply router *(2020.03.03 11:04:17, [link](https://github.com/woni-d/Geteam-http-api/commit/ba2839454f19a379c1adb13d85101d66c4c98315))*

- Add document count to list response, Fix apply api, Remove useless fields in apply schema *(2020.03.03 09:54:03, [link](https://github.com/woni-d/Geteam-http-api/commit/3cf598a75bd19d558ddd2f83f85ac028115db7b6))*

- Add /register/compareEmail, Add id to payload in JWT *(2020.03.03 09:48:19, [link](https://github.com/woni-d/Geteam-http-api/commit/20dfcb1c2e26dcb2f6ebcc403e641f0f4d1f00a9))*

- Add promise in class RedisClient, Fix address in email *(2020.03.01 22:12:45, [link](https://github.com/woni-d/Geteam-http-api/commit/0b91c2d91d6a367228628c92691432de7602362f))*

- Remove unnecessary then, catch, Fix isAccepted *(2020.03.01 17:35:06, [link](https://github.com/woni-d/Geteam-http-api/commit/8490c6d7d3f83f144318c352ae32e30b25243181))*

- Add enableModify, enableApply,  isApplied, isAccepted in board router *(2020.03.01 16:46:27, [link](https://github.com/woni-d/Geteam-http-api/commit/c9a5014d0b6e0301dc3d39fc5f2e776234ec91c9))*

- Remove unused statics method in mongoose schema *(2020.03.01 15:08:37, [link](https://github.com/woni-d/Geteam-http-api/commit/baf9bdd0362dc8ad6ed7dc43f8713f818c36f234))*

- Add class RedisClient to gather logic, Remove db checking in '/verify' *(2020.03.01 14:57:36, [link](https://github.com/woni-d/Geteam-http-api/commit/736de167c8646a270a3b648e14c7894f5868032f))*

- Merge pull request #5 from kyw017763/feat/apply  Feat/apply *(2020.03.01 13:44:04, [link](https://github.com/woni-d/Geteam-http-api/commit/2eb0df0c37c0a3f76690e4058d77acf365e7a0a2))*

- Merge pull request #4 from kyw017763/feat/auth  Add verify end-point, Fix end-point(unregister) *(2020.03.01 13:40:44, [link](https://github.com/woni-d/Geteam-http-api/commit/9acf9729f0e022e29fbf134f2ec169e813ebae14))*

- Merge branch 'master' into feat/auth *(2020.03.01 13:39:50, [link](https://github.com/woni-d/Geteam-http-api/commit/12e098290a10db96be88b149f6811c57ba2c73a6))*

- Fix apply router to work *(2020.03.01 08:23:55, [link](https://github.com/woni-d/Geteam-http-api/commit/472642430b485d0eebb5fabdc103b6f5935eab1e))*

- Add study logic in apply router, Fix apply schema's fields *(2020.02.29 17:11:15, [link](https://github.com/woni-d/Geteam-http-api/commit/909df6f6dc06df3bd683791201366e6465e5abfa))*

- Fix 'throw new err' to 'throw new Error(err)' *(2020.02.29 15:31:53, [link](https://github.com/woni-d/Geteam-http-api/commit/b9b8ec2acdf565de0339390a9934ae92814ec73d))*

- Fix board router path to remove category params *(2020.02.29 12:16:09, [link](https://github.com/woni-d/Geteam-http-api/commit/c269aca4aefa757e2fdfcb34b891204e08d55e3c))*

- Fix conflict *(2020.02.29 10:35:55, [link](https://github.com/woni-d/Geteam-http-api/commit/9c78d921695bf0b36af9985b183c6be643cba9fe))*

- Merge pull request #3 from kyw017763/feat/board  Feat/board *(2020.02.29 10:32:33, [link](https://github.com/woni-d/Geteam-http-api/commit/5238beb046a42be8db08b60a568a216d03b3c7bf))*

- Fix router path, Add listNum,order,limit, Remove auto-increment *(2020.02.29 10:31:21, [link](https://github.com/woni-d/Geteam-http-api/commit/4e79684d18aa6c08c686af1aac4c41f596b37726))*

- Add endDay condition, populate to board router, Fix schema name, interface to populate *(2020.02.29 08:38:30, [link](https://github.com/woni-d/Geteam-http-api/commit/b6f6237373f8a2bd0b8f34cd900922d4e02a1869))*

- Add verify that jwt's owner&request's owner are the same using passport-jwt *(2020.02.28 21:14:00, [link](https://github.com/woni-d/Geteam-http-api/commit/cef6b644cdd761dba3b112e3f3fcc416b05e3f0f))*

- Add contest logic, pagination, hit in board router, Fix part field(contest) *(2020.02.28 19:57:08, [link](https://github.com/woni-d/Geteam-http-api/commit/2937a07a1c368818c04209f88d2ea9e0245de8c6))*

- Add status code 204 to res, Fix snake case to cammel case in board router *(2020.02.28 18:36:23, [link](https://github.com/woni-d/Geteam-http-api/commit/3692ad5dcb09458b7062440d5cddc7399a7025c2))*

- Add study logic in board router, Change member to account *(2020.02.28 14:29:59, [link](https://github.com/woni-d/Geteam-http-api/commit/ae706718c22072ff1e9e0008fc298d168461fd79))*

- Merge pull request #2 from kyw017763/feat/counting  Feat/counting *(2020.02.23 13:59:55, [link](https://github.com/woni-d/Geteam-http-api/commit/95d79ea9bc29833e3f2538ca54adefdbfe36ea5f))*

- Use visit, member counting increase function *(2020.02.23 13:58:48, [link](https://github.com/woni-d/Geteam-http-api/commit/8196e88d8294363f3e4baf4f5a327450422728bc))*

- Add enum to kind field *(2020.02.23 13:46:15, [link](https://github.com/woni-d/Geteam-http-api/commit/6e08b3dbc5023658e9ddcb34e0bce1744b3dc8bc))*

- Add verify end-point, Fix end-point(unregister) *(2020.02.23 08:35:20, [link](https://github.com/woni-d/Geteam-http-api/commit/bb28035254eb752bb072b0a57e99e76132b055a3))*

- Add visit,member,list,apply,team counting to redis *(2020.02.22 18:37:01, [link](https://github.com/woni-d/Geteam-http-api/commit/8e05704266e86b75d7831311bcbbed6e12b76680))*

- Merge pull request #1 from kyw017763/feat/auth  Feat/auth *(2020.02.22 14:07:52, [link](https://github.com/woni-d/Geteam-http-api/commit/3d31d67536a1a7c3dfc1d5c744a8f789c4e9ad85))*

- Add status code to res in auth router, Fix account verify key (exclude '/') *(2020.02.22 12:59:52, [link](https://github.com/woni-d/Geteam-http-api/commit/c6b2b0915509af7dc273fa53f6e25f2205d0a81b))*

- Add jwt logic in auth router *(2020.02.22 11:41:29, [link](https://github.com/woni-d/Geteam-http-api/commit/6f52556e05ba7e1268b2ef442b2ff490a5785263))*

- Fix auth email logic in auth router(change post to get) *(2020.02.21 10:27:30, [link](https://github.com/woni-d/Geteam-http-api/commit/244a6122b20189877734c640230f8e82ad4654c7))*

- Fix mongodb connection *(2020.02.21 09:02:12, [link](https://github.com/woni-d/Geteam-http-api/commit/e486509f4f898f3d98e2a800764b02f6c579a434))*

- Add ref to schema, schema's interface *(2020.02.21 06:30:50, [link](https://github.com/woni-d/Geteam-http-api/commit/bed77e5f2b1a2a23509dc7f7147d75adf16575cd))*

- Add schema's interface *(2020.02.20 21:26:21, [link](https://github.com/woni-d/Geteam-http-api/commit/cb1a8774a1a8613f48ad720b2c36fcd4960c9574))*

- Add /signup/email *(2020.02.20 19:44:06, [link](https://github.com/woni-d/Geteam-http-api/commit/63453576f03ff1f4afb14eba7ea94889232e607d))*

- Add mongoose schema, connection *(2020.02.20 16:17:11, [link](https://github.com/woni-d/Geteam-http-api/commit/9de2f7c30860a93f3eda9da9d6a38be9c4e9f214))*

- Initial commit *(2020.02.20 11:29:36, [link](https://github.com/woni-d/Geteam-http-api/commit/b4448eb946d3a152c0059219b38436e60e654238))*

