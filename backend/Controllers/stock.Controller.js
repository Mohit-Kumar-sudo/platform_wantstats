const mongoose = require('mongoose');
const fetch = require('node-fetch');
const cron = require("node-cron");
const HTTPStatus = require('http-status');

// Import the stock schema
const marqueeStockSchema = require('../Models/stock.Model');

// Create the model
const marqueeStockModel = mongoose.model('AllStocks', marqueeStockSchema);

// Stock data arrays
const stockData1 = ['^GSPC', '^RUT', 'DX-Y.NYB', 'USDJPY', 'EURUSD'];
const stockData2 = ['GC=F', '^TNX', 'CL=F', 'BZ=F', 'ES=F'];
const stockData3 = ['YM=F', '^FTSE', '^GDAXI', '^N225', '^SSEC'];
const filterData1 = ['^NYA', '^FTSE', '^N225'];
const filterData2 = ['000001.SS', 'ENX.PA', '^HSI', '399001.SZ'];
const filterData3 = ['^GSPTSE', '^BSESN', '^NSEI'];

let globalStock = [];
let filterStocks = [];

// Function to add marquee stocks to the database
const addMarqueeStocks = async function (marquee, id) {
    try {
        const queryPromise = await marqueeStockModel.updateOne(
            { id: id },
            { stocks: marquee },
            { upsert: true }
        );
        return queryPromise;
    } catch (error) {
        console.error("Error adding marquee stocks:", error);
    }
};

// Function to get marquee stocks from the database
const getMarqueeStocks = async function (req, res, id) {
    try {
        const stockData = await marqueeStockModel.findOne({ id: id });
        if (!stockData) {
            return res.status(HTTPStatus.NOT_FOUND).send({ message: "Stocks not found" });
        }
        return res.status(HTTPStatus.OK).send(stockData);
    } catch (error) {
        console.error("Error fetching marquee stocks:", error);
        return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({ message: "Error fetching stocks" });
    }
};

// Function to get Alpha Vantage data
async function getAlphaVantageData(stocks) {
    for (const symbol of stocks) {
        await getStockDetails(symbol);
    }
}

// Function to fetch stock details from Alpha Vantage
async function getStockDetails(symbol) {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=MTR5TAL34JWY9WKL`, {
            method: 'get',
            headers: { 'content-type': 'application/json' }
        });
        const data = await response.json();
        if (data) {
            globalStock.push(data);
        }
    } catch (error) {
        console.log("Error fetching stock details:", error);
    }
}

// Function to call stock data fetching
async function callingStock() {
    await getAlphaVantageData(stockData1);
    setTimeout(async () => await getAlphaVantageData(stockData2), 60000);
    setTimeout(async () => await getAlphaVantageData(stockData3), 120000);
    setTimeout(() => {
        addMarqueeStocks(globalStock, "1111111111");
    }, 130000);
}

// Function to call filter fetching
async function callingFilter() {
    await getAlphaVantageFilter(filterData1);
    setTimeout(async () => await getAlphaVantageFilter(filterData2), 60000);
    setTimeout(async () => await getAlphaVantageFilter(filterData3), 120000);
    setTimeout(() => {
        addMarqueeStocks(filterStocks, "2222222222");
    }, 130000);
}

// Cron jobs for periodic stock updates
cron.schedule('0 */5 * * *', function () {
    console.log("inside filter cron");
    callingFilter();
});

cron.schedule('0 */3 * * *', function () {
    console.log("inside cron");
    callingStock();
});

// Function to get Alpha Vantage filter data
async function getAlphaVantageFilter(stocks) {
    for (const symbol of stocks) {
        await getFilterDetails(symbol);
    }
}

// Function to fetch filter details from Alpha Vantage
async function getFilterDetails(symbol) {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=MTR5TAL34JWY9WKL`, {
            method: 'get',
            headers: { 'content-type': 'application/json' }
        });
        const data = await response.json();
        if (data) {
            filterStocks.push(data);
        }
    } catch (error) {
        console.log("Error fetching filter details:", error);
    }
}

module.exports = {
    addMarqueeStocks,
    getMarqueeStocks,
    callingStock,
    callingFilter
};