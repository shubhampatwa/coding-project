# Harbor Take Home Project

Welcome to the Harbor take home project. We hope this is a good opportunity for you to showcase your skills.

## The Challenge

Build us a REST API for calendly. Remember to support

- Setting own availability
- Showing own availability
- Finding overlap in schedule between 2 users

It is up to you what else to support.

## Expectations

We care about

- Have you thought through what a good MVP looks like? Does your API support that?
- What trade-offs are you making in your design?
- Working code - we should be able to pull and hit the code locally. Bonus points if deployed somewhere.
- Any good engineer will make hacks when necessary - what are your hacks and why?

We don't care about

- Authentication
- UI
- Perfection - good and working quickly is better

It is up to you how much time you want to spend on this project. There are likely diminishing returns as the time spent goes up.

## Submission

Please fork this repository and reach out to Prakash when finished.

## Next Steps

After submission, we will conduct a 30 to 60 minute code review in person. We will ask you about your thinking and design choices.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Shubham Patwa](https://www.linkedin.com/in/shubham-patwa-17b33378/)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).


# Project Calendly

## Assumption
- User can be created with email and unique user name
- timeSlot(time slot for a meeting) is defined for each user and had range 15 to 60 in minutes
- All time are saved in UTC
- User is allowed to provides the availabilty weekly for now, can be extend if needed
- Attendee can be notified with email for meeting detail, there is no such login allowed for user
- For DB we use postgres
- Application is deployed using docker and docker-compose
- Swagger is already integrated in the app
- Postman url will be added at the end here: [POSTMAN](https://grey-robot-370973.postman.co/workspace/shubhampatwa-personal-Workspace~6b15256b-df22-47ab-8c4a-d62a78ddb427/collection/556587-9fcced75-b720-4cdf-bcb2-823ce2bc67e6?action=share&creator=556587)
