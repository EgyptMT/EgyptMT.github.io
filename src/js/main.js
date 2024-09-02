$(document).ready(function () {
    $('#myModal').modal('show')
    $('#mailbutton').click(function (event) {
        window.location = "mailto:h.marzouk@uni-muenster.de";
    });
});

var depthSlices = ["1", "6", "10", "22", "30", "50", "65", "85"]; // Example depth slices
var depthSlicesActualValues = ["0.9040", " 5.6410", "9.7630", "21.8470", "28.5010", "48.3970", "63.0170", "82.0220"]

// Add data to map ///////
var option = {
    timeline: {
        data: depthSlices,
        axisType: 'category',
        autoPlay: true,
        playInterval: 2000,
        loop: true,
        bottom: 20,

        label: {
            color: "rgba(174, 47, 47, 1)",
            position: "auto",
            fontSize: 14,
            formatter: function (s) {
                return s + ' km';
            }
        }
    },

    tooltip: {
        // trigger: 'item',
        backgroundColor: 'rgba(255,255,255,0.9)',
        textStyle: {
            color: '#333'
        },
        position: 'top',
        formatter: function (params) {
            return (
                '<b>Long:</b> ' +
                params.data[0].toFixed(2) + '°' +
                '<br><b>Lat:</b> ' +
                params.data[1].toFixed(2) + '°' +
                '<br><b>Depth:</b> ' +
                params.data[2].toFixed(2) + ' km' +
                '<br><b>Resistivity:</b> ' +
                Math.pow(10, params.data[3]).toFixed(2) + ' ohm.m'
            );
        }
    },
    toolbox: {
        feature: {
            restore: { show: true },
            saveAsImage: { show: true }
        },
    },
    backgroundColor: 'transparent',

    lmap: {
        // Initial options of Leaflet
        // See https://leafletjs.com/reference.html#map-option for details
        // NOTE: note that this order is reversed from Leaflet's [lat, lng]!
        center: [30, 24], // [lng, lat]
        zoom: 7,
        // Whether the map and echarts automatically handles browser window resize to update itself.
        resizeEnable: true,
        // Whether echarts layer should be rendered when the map is moving. Default is true.
        // if false, it will only be re-rendered after the map `moveend`.
        // It's better to set this option to false if data is large.
        renderOnMoving: true,
        // echarts layer is interactive. Default: true
        echartsLayerInteractive: true,
        // enable large mode. Default: false
        largeMode: true,
        // Note: Please DO NOT use the initial option `layers` to add Satellite/RoadNet/Other layers now.
        // Do it after you have retrieved the leaflet instance.



    },
    visualMap: {
        show: true,
        type: 'continuous',
        left: 50,
        min: 0,
        max: 4,
        inverse: false,
        seriesIndex: 0,
        calculable: true,
        orient: 'horizontal',
        right: 50,
        // left:
        top: '3%',
        align: 'bottom',
        text: [' log10(Resistivity)', null],
        textStyle: {
            color: '#313695',
            fontWeight: "bold",
            fontSize: 16
        },
        formatter: '{value}',
        dimension: 3, // map the third column
        // label: {
        //     show: true
        // },
        // emphasis: {
        //     itemStyle: {
        //         shadowBlur: 4,
        //         shadowColor: 'rgba(0, 0, 0, 0.5)'
        //     }
        // },
        inRange: {
            color: [
                "#7F0000", // Dark Red
                "#FF0000", // Red
                "#FF7F00", // Orange
                "#FFFF00", // Yellow
                "#7FFF7F", // Light Green
                "#00FFFF", // Light Cyan
                "#007FFF", // Cyan
                "#0000FF", // Blue
                "#00007F"  // Dark Blue
                // '#a50026',
                // '#d73027',
                // '#f46d43',
                // '#fdae61',
                // '#fee090',
                // '#ffffbf',
                // '#e0f3f8',
                // '#abd9e9',
                // '#74add1',
                // '#4575b4',
                // '#313695',
                // '#313695',

            ],
            opacity: 0.7

        },
    },
    opacity: [1, 1],
    animation: false,
    emphasis: {
        itemStyle: {
            color: 'yellow'
        },

    },
    series: [
        {
            type: 'scatter', // heatmap
            symbol: 'circle',

            // use `lmap` as the coordinate system
            coordinateSystem: "lmap",
            // data: data.map(function (val) {
            //     return val.slice(0, -1);
            // }),
            data: data,
            symbolSize: 7,
            // blurSize: 5,
            emphasis: {
                itemStyle: {
                    borderColor: '#333',
                    borderWidth: 1
                }
            },

            animation: false
        },
    ],
    options: depthSlicesActualValues.map(function (depth, index) {
        return {
            series: [
                {
                    data: data.filter(function (d) {
                        return d[2] == depth;

                    })
                }
            ]
        };
    })
};


// initialize echart
var chart = echarts.init(document.getElementById("map"));
chart.setOption(option);

// calculate 1d model
chart.on('click', { seriesIndex: 0 }, function (params) {
    plotAllDepths(params.data);
});

function plotAllDepths(clickedData) {
    // Extract the longitude, latitude, Moho depth, LAB depth, density, and magnetics from the clicked data
    var clickedLon = clickedData[0];
    var clickedLat = clickedData[1];
    var mohoDepth = clickedData[4]; // Moho depth from the fifth column
    var labDepth = clickedData[5];  // LAB depth from the sixth column
    var density = clickedData[6];   // Density from the seventh column
    var magnetics = clickedData[7]; // Magnetics from the eighth column

    // Filter the data to get all depth slices for the clicked location
    var filteredData = data.filter(function (d) {
        return d[0] === clickedLon && d[1] === clickedLat;
    });

    // Prepare data for plotting resistivity (from chart1)
    var depthValues = [];
    var resistivityValues = [];
    var densityValues = [];
    var magneticsValues = [];

    filteredData.forEach(function (d) {
        var depth = d[2];
        var resistivity = Math.pow(10, d[3]); // Convert log10(resistivity) to actual resistivity

        depthValues.push(depth);
        resistivityValues.push(resistivity);
        densityValues.push([d[6], depth]);
        magneticsValues.push([d[7], depth]);
    });

    // Sort the data by depth to ensure correct plotting
    var sortedData = depthValues.map((depth, index) => ({
        depth: depth,
        resistivity: resistivityValues[index],
        density: densityValues[index],
        magnetics: magneticsValues[index]
    })).sort((a, b) => a.depth - b.depth);

    // Extract sorted depths and resistivities for plotting
    var sortedDepths = sortedData.map(d => d.depth);
    var sortedResistivities = sortedData.map(d => d.resistivity);
    var sortedDensities = sortedData.map(d => d.density);
    var sortedMagnetics = sortedData.map(d => d.magnetics);
    chart1.setOption({

        series: [{
            name: 'Resistivity',
            type: 'line',
            step: 'end',
            data: sortedResistivities.map((res, i) => [res, sortedDepths[i]]),
            lineStyle: {
                width: 2
            },
            markLine: {
                silent: true,
                animation: false,
                data: [
                    {
                        name: 'Moho Depth',
                        yAxis: mohoDepth,  // Use the Moho depth from the fifth column
                        label: {
                            position: 'insideEndTop',
                            formatter: '{b}: {c} km',
                        }
                    },
                    {
                        name: 'LAB Depth',
                        yAxis: labDepth,  // Use the LAB depth from the sixth column
                        label: {
                            position: 'insideEndTop',
                            formatter: '{b}: {c} km',
                        }
                    }
                ],
                lineStyle: {
                    width: 2,
                    color: '#EDC6C3',
                    type: 'dashed',
                },
            }
        }]
    });
    // Update and plot the 1D density and magnetics chart(chart2)
    chart2.setOption({
        series: [
            {
                name: 'Density',
                data: sortedDensities,
                markLine: {
                    silent: true,
                    animation: false,
                    data: [
                        {
                            name: 'Moho Depth',
                            yAxis: mohoDepth,  // Use the Moho depth from the fifth column
                            label: {
                                position: 'insideEndTop',
                                formatter: '{b}: {c} km',
                            }
                        },

                    ],
                    lineStyle: {
                        width: 2,
                        color: '#EDC6C3',
                        type: 'dashed',
                    },
                }

            },
            {
                name: 'Magnetics',
                data: sortedMagnetics
            }
        ]
    });
}


// get Leaflet extension component and Leaflet instance
var lmapComponent = chart.getModel().getComponent("lmap");
var lmap = lmapComponent.getLeaflet();

// L.tileLayer(
//     "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
//     {
//         attribution:
//             "Tiles &copy; Esri &mdash",
//     }
// ).addTo(lmap);

var layers = [];
for (var providerId in providers) {
    layers.push(providers[providerId]);
}
// L.geoJson(egyptBoundary, {
//     // Add invert: true to invert the geometries in the GeoJSON file
//     invert: true,
//     renderer: L.svg({ padding: 5 }),
//     color: 'gray', fillOpacity: 0.4, weight: 0, setZIndex: 0
// }).addTo(lmap);

L.control.scale(
    {
        imperial: false,
    }).addTo(lmap);


var ctrl = L.control.iconLayers(layers).addTo(lmap);

lmap.addControl(new L.Control.LinearMeasurement({
    unitSystem: 'metric',
    color: '#FF0080',
    type: 'line'
}));


L.Control.betterFileLayer({
    fileSizeLimit: 60240, // File size limit in kb (10 MB)),
    text: { // If you need translate
        title: "Import a file (Max 60 MB)", // Plugin Button Text
    },
}).addTo(lmap);

var notification = L.control
    .notifications({
        className: 'pastel',
        timeout: 5000,
        position: 'topleft',
        closable: true,
        dismissable: true,
    })
    .addTo(lmap);

lmap.on("bfl:layerloaded", function () { notification.success('Success', 'Data loaded successfully'); })
lmap.on("bfl:layerloaderror", function () { notification.alert('Error', 'Unable to load file'); })
lmap.on("bfl:filenotsupported", function () { notification.alert('Error', 'File type not supported'); })
lmap.on("bfl:layerisempty", function () { notification.warning('Error', 'No features in file'); })
lmap.on("bfl:filesizelimit", function () { notification.alert('Error', 'Maximun file size allowed is 50 MB'); })



option1 = {
    legend: {
        top: 30,
        data: ['Resistivity'],
    },
    title: {
        text: '1D Resistivity Profile',
        left: '1%'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: "cross"
        },
        textStyle: {
            fontSize: 12,
        },
        valueFormatter: (value) => + value.toFixed(2) + ' ohm.m',
    },
    toolbox: {
        feature: {
            restore: { show: true },
            dataView: {
                show: true,
            },
            // dataZoom: {
            //     show: true,
            //     yAxisIndex: false,
            // },
            saveAsImage: {
                show: true,
                pixelRatio: 5,
                name: 'Resistivity Profile'
            }
        },
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '4%',
        containLabel: true
    },
    dataZoom: [
        {
            type: 'inside',
            xAxisIndex: [0],
            yAxisIndex: [0],
        },
    ],
    xAxis: {
        name: 'Resistivity (ohm.m)',
        nameLocation: 'middle',
        min: 10,
        max: 1500,
        type: 'log',  // Set x-axis to logarithmic scale
        axisLabel: {
            formatter: '{value}'
        },
        nameTextStyle: {
            verticalAlign: 'top',
            lineHeight: 27,
            fontWeight: 'bold'
        },
    },
    yAxis: {
        name: 'Depth (Km)',
        type: 'value',
        inverse: true,  // Invert the y-axis so that depth increases downward
        min: 0,
        max: 240,  // Set max depth to 200 km
        interval: 20,
        nameLocation: 'start',
        nameTextStyle: {
            fontWeight: 'bold'
        },
        axisLabel: {
            formatter: '{value} km'
        },
    },
    series: [{
        name: 'Resistivity',
        type: 'line',
        step: 'end',
        symbol: 'none',

        data: [],  // Data will be dynamically updated on click
        lineStyle: {
            width: 2
        },
        markLine: {
            silent: true,
            animation: false,
            data: [
                {
                    name: 'Moho Depth',
                    yAxis: 0,  // Placeholder, will be updated dynamically
                    label: {
                        position: 'insideEndTop',
                        formatter: '{b}: {c} km',
                    }
                },
                {
                    name: 'LAB Depth',
                    yAxis: 0,  // Placeholder, will be updated dynamically
                    label: {
                        position: 'insideEndTop',
                        formatter: '{b}: {c} km',
                    }
                }
            ],
            lineStyle: {
                width: 2,
                color: '#EDC6C3',
                type: 'dashed',
            },
        }
    }]
};

// initialize echart
var chart1 = echarts.init(document.getElementById("chart1"));
chart1.setOption(option1);


option2 = {
    legend: {
        top: 30,
        data: ['Density', 'Magnetics'],
    },
    title: {
        text: '1D Density and Magnetics Profile',
        left: '1%'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: "cross"
        },
        textStyle: {
            fontSize: 12,
        },
        formatter: function (params) {
            // console.log(params)

            return `${params[0].seriesName}: ${parseFloat(params[0].value).toFixed(2)}  kg/m3 <br/>${params[1].seriesName}: ${parseFloat(params[1].value).toFixed(5)} SI <br/>`;
        }
        // valueFormatter: (value) => value + ' kg/m3',

    },
    toolbox: {
        feature: {
            restore: { show: true },
            dataView: {
                show: true,
            },
            // dataZoom: {
            //     show: true,
            //     yAxisIndex: false,
            // },
            saveAsImage: {
                show: true,
                pixelRatio: 5,
                name: 'Resistivity Profile'
            }
        },
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '4%',
        // show: false,
        containLabel: true
    },
    dataZoom: [
        {
            type: 'inside',
            xAxisIndex: [0, 1],
            yAxisIndex: [0],
        },
    ],
    yAxis: {
        name: 'Depth (Km)',
        type: 'value',
        inverse: true,  // Invert the y-axis so that depth increases downward
        min: 0,
        max: 60,  // Set max depth to 200 km
        position: 'right',
        interval: 20,
        nameLocation: 'start',
        nameTextStyle: {
            fontWeight: 'bold'
        },
        axisLabel: {
            formatter: '{value} km'
        },
    },
    xAxis: [
        {
            name: 'Density (kg/m³)',
            type: 'value',
            nameLocation: 'middle',

            position: 'top',
            axisLabel: {
                formatter: '{value}',
                color: '#33CC33' // Green color for Density labels


            },
            nameTextStyle: {
                verticalAlign: 'top',
                lineHeight: 27,
                fontWeight: 'bold'
            },
            axisLine: {
                // onZero: false,
                lineStyle: {
                    color: '#33CC33'
                }
            }

        },
        {
            name: 'Magnetics (nT)',
            type: 'value',
            position: 'bottom',
            nameLocation: 'middle',

            offset: 0,
            axisLabel: {
                formatter: '{value}',
                color: '#FF0000' // Red color for Magnetics labels

            },
            nameTextStyle: {
                verticalAlign: 'bottom',
                lineHeight: 27,
                fontWeight: 'bold'
            },
            axisLine: {
                // onZero: false,
                lineStyle: {
                    color: '#FF0000'
                }
            }

        }
    ],

    series: [
        {
            name: 'Density',
            type: 'line',
            step: 'end',
            showSymbol: false,
            symbol: 'none',
            xAxisIndex: 0, // Link to the first x-axis
            data: [],  // Data will be dynamically updated on click
            lineStyle: {
                width: 2,
                color: '#33CC33'
            }, itemStyle: {
                color: '#33CC33' // Ensure legend symbol matches the line color
            },
        },
        {
            name: 'Magnetics',
            type: 'line',
            step: 'end',
            symbol: 'none',

            xAxisIndex: 1, // Link to the second x-axis
            data: [],  // Data will be dynamically updated on click
            lineStyle: {
                width: 2,
                color: '#FF0000'
            }, itemStyle: {
                color: '#FF0000' // Ensure legend symbol matches the line color
            }
        }
    ]
};

// initialize echart
var chart2 = echarts.init(document.getElementById("chart2"));
chart2.setOption(option2);

// Function to load default data point
function loadDefaultData() {
    // Choose a default data point (for example, the first data point in the dataset)
    var defaultData = data[0]; // Adjust the index or logic as needed to select a meaningful default

    // Plot the default data point
    plotAllDepths(defaultData);
}

// Call the function to load the default data point when the chart initializes
loadDefaultData();

window.addEventListener('resize', function () {
    chart1.resize();
    chart2.resize();

});