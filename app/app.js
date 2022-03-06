// data details & default variables
const BKK = { lat: 13.7563, lon: 100.5018 };
const CNX = { lat: 18.7883, lon: 98.9853 };
const freq = { daily: "Daily", hours: "3hours" };
var currentCity = BKK;
var currentFreq = freq.daily;

var main = function () {
  //API calling to show the results
  var CallNOSTRA = function (lat, lon, freq) {
    $.ajax({
      url: "https://api.nostramap.com/Service/V2/GeoLocation/GetWeather",
      dataType: "jsonp",
      type: "GET",
      contentType: "application/json",
      data: {
        key: "GWDinQKEsRojkb0NRMX07vpv(WvoZtvrEGdOvejJs4WfVIqrrRwYmuBAKx5Igmlt63jCpjYJarctvLxp13Qoil0=====2",
        lat: lat,
        lon: lon,
        frequency: freq,
      },
      success: function (results) {
        //retrive result data
        console.log(results.results.locationName, freq);
        console.log(results.results);
        var result = results.results.weather;
        var temp = [];
        var date = [];
        var icon = [];
        var barColors = [];

        //type of frequency
        if (freq == "Daily") {
          for (i = 0; i < 7; i++) {
            temp.push(result[i].temperature.temp);
            var time = result[i].timeStamp;
            date.push(time.slice(0, 10));

            icon.push(result[i].icon);

            barColors.push("#7F9BA6");
          }
        } else {
          for (i = 0; i < 8; i++) {
            temp.push(result[i].temperature.temp);
            var time = result[i].timeStamp;
            date.push(time.slice(-9, -3));

            icon.push(result[i].icon);

            barColors.push("#7F9BA6");
          }
        }

        //show the chart
        var xValues = date;
        var yValues = temp;
        var barColors = barColors;
        const ctx = document.getElementById("myChart").getContext("2d");

        //draw bar chart
        new Chart(ctx, {
          type: "bar",
          plugins: [{
            afterDraw: chart => {      
              var ctx = chart.chart.ctx; 
              var xAxis = chart.scales['x-axis-0'];
              var yAxis = chart.scales['y-axis-0'];
              xAxis.ticks.forEach((value, index) => {  
                var x = xAxis.getPixelForTick(index);      
                var image = new Image();
                image.src = icon[index],
                ctx.drawImage(image, x - 12, yAxis.bottom + 10);
              });      
            }
          }],
          data: {
            labels: xValues,
            datasets: [
              {
                backgroundColor: barColors,
                data: yValues,
              },
            ],
          },
          options: {
            legend: { display: false },
            title: {
              display: true,
              text:
                "Weather Forecast of : " +
                results.results.locationName +
                " for " +
                freq,
            },
            layout: {
              padding: {
                bottom: 30
              }
            },
            scales: {
              yAxes: [{ 
                ticks: {
                  beginAtZero: true
                }
              }],
              xAxes: [{
                ticks: {
                  display: false
                }   
              }],
            }
          },
        });
      },
      error: function (response) {
        console.log(response);
      },
    });
  };

  //default value BKK for daily
  CallNOSTRA(currentCity.lat, currentCity.lon, currentFreq);

  //when click the BKK btn
  $(".button .BKK").on("click", function () {
    currentCity = BKK;
    CallNOSTRA(currentCity.lat, currentCity.lon, currentFreq);
  });

  //when click the CNX btn
  $(".button .CNX").on("click", function () {
    currentCity = CNX;
    CallNOSTRA(currentCity.lat, currentCity.lon, currentFreq);
  });

  //when click the Daily btn
  $(".button .daily").on("click", function () {
    currentFreq = freq.daily;
    CallNOSTRA(currentCity.lat, currentCity.lon, currentFreq);
  });

  $(".button .3hrs").on("click", function () {
    currentFreq = freq.hours;
    CallNOSTRA(currentCity.lat, currentCity.lon, currentFreq);
  });
};

$(document).ready(main);
