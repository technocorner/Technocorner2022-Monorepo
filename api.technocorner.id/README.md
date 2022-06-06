## Server

- [Server1 - Heroku](https://api.technocorner.id/info)
- [Server2 (Backup) - Vercel)](https://api2.technocorner.id/info)
- [Server3 (Backup & Test) - Deta](https://api3.technocorner.id/info)
- [Server4 (Backup) - Netlify](https://api4.technocorner.id)

## API Documentations (Not Updated)

[API Documentations](https://go.postman.co/workspace/Team-Workspace~6213e3b9-503f-4071-8ef4-3b2a12973874/api/34e61b0d-4575-4894-a4f9-86ac0f927f50)\
Login using google account: [account](https://github.com/WebDev-Technocorner/akun)

## Endpoints for Monitoring

| Endpoint                                          | Description                                            |
| ------------------------------------------------- | ------------------------------------------------------ |
| [`/info`](https://api.technocorner.id/info)       | Displays application information.                      |
| [`/metrics`](https://api.technocorner.id/metrics) | Shows metrics information for the current application. |
| [`/health`](https://api.technocorner.id/health)   | Shows application health information.                  |

## Scripts (npm run ...)

| Script       | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| `dev`        | Start API server in development mode.                         |
| `build`      | Convert server code to NodeJS code.                           |
| `build-all`  | Build NodeJS code to all deployment target.                   |
| `deploy-all` | Deploy API to each target server (except Heroku. Read below!) |
| `start`      | Start API server in production mode.                          |

## Deploy to Heroku

After running `build-heroku` or `build-all`:
`cd deploy/heroku`
`git add .`
`git commit -m "Your commit message"`
`git push`

## Known Issues

- Heroku
  - /linktree return 503 Service Temporarily Unavailable causing NodeJS FetchError (Apr, 18). I don't know why, but Vercel handle it properly.
- Vercel
  - Can't handle file upload more than 5 Mb (approx, maybe slightly larger (or even lower :d))
- Deta
  - File upload not tested
  - Endpoint /proxy doesn't work
- Netlify
  - File upload not tested
  - Endpoint /proxy doesn't work
  - Endpoint /avatar doesn't work. (See [Limitation on Static Files](https://web.archive.org/web/20210816034525/https://blog.neverendingqs.com/2018/09/08/expressjs-on-netlify.html))

## Note

Package `@firebase/app-compat` is required to deploy to netlify
