// $(document).ready(function () {
//     $('#myModal').modal('show')
//     $('#mailbutton').click(function (event) {
//         window.location = "mailto:h.marzouk@uni-muenster.de";
//     });
// });

// Add data to map ///////
var option = {
    tooltip: {},

    lmap: {
        // Initial options of Leaflet
        // See https://leafletjs.com/reference.html#map-option for details
        // NOTE: note that this order is reversed from Leaflet's [lat, lng]!
        center: [25.56605299, 24.4527963], // [lng, lat]
        zoom: 4,
        // Whether the map and echarts automatically handles browser window resize to update itself.
        resizeEnable: true,
        // Whether echarts layer should be rendered when the map is moving. Default is true.
        // if false, it will only be re-rendered after the map `moveend`.
        // It's better to set this option to false if data is large.
        renderOnMoving: true,
        // echarts layer is interactive. Default: true
        echartsLayerInteractive: true,
        // enable large mode. Default: false
        largeMode: false,
        // Note: Please DO NOT use the initial option `layers` to add Satellite/RoadNet/Other layers now.
        // Do it after you have retrieved the leaflet instance.



    },
    visualMap: {
        show: true,
        left: 50,
        min: 20,
        max: 60,
        seriesIndex: 0,
        calculable: true,
        inRange: {
            color: [
                '#313695',
                '#4575b4',
                '#74add1',
                '#abd9e9',
                '#e0f3f8',
                '#ffffbf',
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026'
            ]
        },

    },
    tooltip: {
        trigger: 'item',
        axisPointer: {
            type: 'cross'
        }
    },
    animation: false,
    emphasis: {
        itemStyle: {
            color: 'yellow'
        }
    },
    series: [
        {
            type: "heatmap",
            // use `lmap` as the coordinate system
            coordinateSystem: "lmap",
            data: [
                [23.32026478, 20.27637973, 30.34760962],
                [25.56605299, 20.27637973, 42.96630851],
                [27.8118412, 20.27637973, 45.49775213],
                [30.05762941, 20.27637973, 48.7240295],
                [32.30341762, 20.27637973, 32.85713883],
                [34.54920583, 20.27637973, 35.56911458],
                [36.79499404, 20.27637973, 41.63799768],
                [23.32026478, 22.38043407, 34.68751309],
                [25.56605299, 22.38043407, 34.97171551],
                [27.8118412, 22.38043407, 32.17713627],
                [30.05762941, 22.38043407, 40.13691411],
                [32.30341762, 22.38043407, 37.52847473],
                [34.54920583, 22.38043407, 42.73498184],
                [23.32026478, 24.4527963, 37.48200797],
                [25.56605299, 24.4527963, 45.53479821],
                [27.8118412, 24.4527963, 43.98811954],
                [30.05762941, 24.4527963, 46.20782306],
                [32.30341762, 24.4527963, 42.40387814],
                [34.54920583, 24.4527963, 40.29420012],
                [36.79499404, 24.4527963, 23.84310335],
                [39.04078225, 24.4527963, 20.77774138],
                [21.07447657, 26.49126256, 64.08249612],
                [23.32026478, 26.49126256, 43.93488018],
                [25.56605299, 26.49126256, 54.92742051],
                [27.8118412, 26.49126256, 55.85253446],
                [30.05762941, 26.49126256, 38.52719897],
                [32.30341762, 26.49126256, 39.77783349],
                [34.54920583, 26.49126256, 22.93593334],
                [35.67209993, 26.49126256, 24.11888804],
                [23.32026478, 28.49384231, 56.99513777],
                [25.56605299, 28.49384231, 51.90506273],
                [27.8118412, 28.49384231, 47.35767466],
                [30.05762941, 28.49384231, 46.79840673],
                [32.30341762, 28.49384231, 36.51139802],
                [34.54920583, 28.49384231, 27.59114101],
                [36.79499404, 28.49384231, 30.53742485],
                [23.32026478, 30.45876097, 61.33040497],
                [25.56605299, 30.45876097, 59.74908984],
                [27.8118412, 30.45876097, 57.85905211],
                [30.05762941, 30.45876097, 59.69796773],
                [32.30341762, 30.45876097, 32.88576836],
                [34.54920583, 30.45876097, 33.46810242],
                [36.79499404, 30.45876097, 42.47400813],
                [23.32026478, 32.38445984, 42.99218227],
                [25.56605299, 32.38445984, 51.28461051],
                [27.8118412, 32.38445984, 41.84716139],
                [30.05762941, 32.38445984, 46.88107402],
                [32.30341762, 32.38445984, 48.91326682],
                [34.54920583, 32.38445984, 39.36288411],
                [36.79499404, 32.38445984, 19.98545529],
            ],
            pointSize: 13,
            blurSize: 0,
        },
    ],
};

// initialize echart
var chart = echarts.init(document.getElementById("map"));
chart.setOption(option);

// get Leaflet extension component and Leaflet instance
var lmapComponent = chart.getModel().getComponent("lmap");
var lmap = lmapComponent.getLeaflet();

L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    {
        attribution:
            "Tiles &copy; Esri &mdash",
    }
).addTo(lmap);





// Add data to leaft chart ///////

const markLine = [];
const positions = [
    'start',
    'middle',
    'end',
    'insideStart',
    'insideStartTop',
    'insideStartBottom',
    'insideMiddle',
    'insideMiddleTop',
    'insideMiddleBottom',
    'insideEnd',
    'insideEndTop',
    'insideEndBottom'
];
for (var i = 0; i < positions.length; ++i) {
    markLine.push({
        name: positions[i],
        yAxis: 1.8 - 0.2 * Math.floor(i / 3),
        label: {
            formatter: '{b}',
            position: positions[i]
        }
    });
    if (positions[i] !== 'middle') {
        const name =
            positions[i] === 'insideMiddle' ? 'insideMiddle / middle' : positions[i];
        markLine.push([
            {
                name: 'start: ' + positions[i],
                coord: [0, 0.3],
                label: {
                    formatter: name,
                    position: positions[i]
                }
            },
            {
                name: 'end: ' + positions[i],
                coord: [3, 1]
            }
        ]);
    }
}
option = {
    animation: false,
    textStyle: {
        fontSize: 14
    },
    xAxis: {
        data: ['A', 'B', 'C', 'D', 'E'],
        boundaryGap: true,
        splitArea: {
            show: true
        }
    },
    yAxis: {
        max: 2
    },
    series: [
        {
            name: 'line',
            type: 'line',
            stack: 'all',
            symbolSize: 6,
            data: [0.3, 1.4, 1.2, 1, 0.6],
            markLine: {
                data: markLine,
                label: {
                    distance: [20, 8]
                }
            }
        }
    ],
    grid: {
        top: 30,
        left: 60,
        right: 60,
        bottom: 40
    }
};


// initialize echart
var chart1 = echarts.init(document.getElementById("chart1"));
chart1.setOption(option);




option = {
    legend: {
        data: ['Altitude (km) vs. temperature (°C)']
    },
    tooltip: {
        trigger: 'axis',
        formatter: 'Temperature : <br/>{b}km : {c}°C'
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value} °C'
        }
    },
    yAxis: {
        type: 'category',
        axisLine: { onZero: false },
        axisLabel: {
            formatter: '{value} km'
        },
        boundaryGap: false,
        data: ['0', '10', '20', '30', '40', '50', '60', '70', '80']
    },
    series: [
        {
            name: 'Altitude (km) vs. temperature (°C)',
            type: 'line',
            symbolSize: 10,
            symbol: 'circle',
            smooth: true,
            lineStyle: {
                width: 3,
                shadowColor: 'rgba(0,0,0,0.3)',
                shadowBlur: 10,
                shadowOffsetY: 8
            },
            data: [15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5]
        }
    ]
};


// initialize echart
var chart2 = echarts.init(document.getElementById("chart2"));
chart2.setOption(option);

window.addEventListener('resize', function () {
    chart2.resize();
    chart1.resize();

});