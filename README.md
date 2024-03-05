# README

This is a simple API wrapper project for the Fillout.com's API.

This project uses Fillout.com's API to fetch form response with an option to filter based on certain criteria.

There are 2 available endpoints

1. `/` - the root endpoint is added for healtcheck purposes
2. `/:formId/filteredResponses` - this endpoint allows client to filter the responses based on certain answers. For example:

```
/cLZojxk94ous/filteredResponses?filters=[ {"id":"dSRAe3hygqVwTpPK69p5td","condition":"equals","value":"2024-02-01"}]
```

# How to start this project

1. Clone this project
2. Don't forget to configure your `.env` file
3. Run `npm install`
4. Run `npm run dev`
