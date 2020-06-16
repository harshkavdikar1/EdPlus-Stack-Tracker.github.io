google.charts.load('current', {packages: ['corechart', 'bar']});
setInterval(updatePrice, 5000)

var batchRequestUrl = "https://cloud.iexapis.com/stable/stock/market/batch?symbols=$$&types=quote&token=pk_4a27bf64fc704fdaac502f9e88b04667"

var singleSymbolRequestUrl = "https://cloud.iexapis.com/stable/stock/$$/batch?types=quote&token=pk_4a27bf64fc704fdaac502f9e88b04667"

var symbols = []


function drawBasic(stock_data) {
      var barchart = [['Stocks', 'Current Price',]]
      symbols.forEach(element => {
        barchart =  barchart.concat([[element, stock_data[element.toUpperCase()].quote.latestPrice]])
      })

      var data = google.visualization.arrayToDataTable(barchart);


      var options = {
        title: 'Stock Prices',
        chartArea: {width: '50%'},
        hAxis: {
          title: 'Price',
          minValue: 0
        },
        vAxis: {
          title: 'Stock Symbols'
        }
      };

      var chart = new google.visualization.BarChart(document.getElementById('chart_div'));

      chart.draw(data, options);
}

function getData() {
    var newSymbol = document.getElementById("inputText").value;
    if (!symbols.includes(newSymbol)) {
        gatherDataFromAPI(newSymbol);
    }

}

function addNewElement(newSymbol) {
    var stockList = document.getElementById("symbolsList");
        var newListItem = document.createElement("li")
        newListItem.className="list-group-item"
        newListItem.innerText=newSymbol
        stockList.appendChild(newListItem)
        symbols = symbols.concat([newSymbol])
        updatePrice()
        document.getElementById("inputText").value = ""
}

function gatherDataFromAPI(symbol) {
    let url = singleSymbolRequestUrl.replace('$$', symbol)
    fetch(url)
    .then(response => response.json())
    .then(() => (addNewElement(symbol))) 
    .catch(e => (
        console.warn(e),
        alert("Invalid Symbol")
    ))

}

function updatePrice(){
    if(symbols.toString().trim() !== "") {
        let url = batchRequestUrl.replace('$$', symbols.toString())
    fetch(url)
    .then(response => response.json())
    .then(data => (
        drawBasic(data)
    )) 
    }
}

