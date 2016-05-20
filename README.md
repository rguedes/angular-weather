# blip-weather

### DEMO
https://jsfiddle.net/rguedes/y9o84ot3/22/


### Prerequisites

You need git to clone the blip-weather repository.

We also use a number of node.js tools to initialize and test blip-weather. You must have node.js and
its package manager (npm) installed.

### Clone blip-weather

Clone the blip-weather repository using [git][git]:

```
git clone https://github.com/rguedes/blip-weather.git
cd blip-weather
```

### Install Dependencies

run:

```
npm install
```

### Run the Application

start server:

```
npm start
```

Now browse to the app at `http://localhost:8000/`.



## Testing

* the configuration is found at `e2e-tests/protractor-conf.js`
* the end-to-end tests are found in `e2e-tests/scenarios.js`

Run server:

```
npm start
```

In another console run:

```
npm run protractor
```