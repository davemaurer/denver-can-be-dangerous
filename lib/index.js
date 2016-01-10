'use strict';

const fs = require('fs');
const _ = require('lodash');

console.time('entire process');
console.time('parse csv');

let trafficData = fs.readFileSync('./data/traffic-accidents.csv').toString()
    .split('\r\n')
    .map(row => row.split(','));

let crimeData = fs.readFileSync('./data/crime.csv').toString()
    .split('\r\n')
    .map(row => row.split(','))
    .filter(row => {
      return row.IS_CRIME === '1';
  });

let parsedData = function(data) {
  let columnData = data.slice(1);
  return columnData.map(incident => addHeadersToRowData(incident, data));
};

function addHeadersToRowData(incident, data) {
  let columnHeader = data[0];
  let rows = {};
  for (let i = 0; i < incident.length; i++)
    rows[columnHeader[i]] = incident[i];
  return rows;
}

let computeData = function(data, id) {
    _.chain(data)
      .filter(row => row[id])
      .groupBy(id)
      .map(function (incidents, incidentAddress) {
        return [incidentAddress, incidents.length];
      })
      .sort(function (a, b) {
        return b[1] - a[1];
      })
      .take(5)
      .map(function(incidentGroup) {
       return `${incidentGroup[0]} - ${incidentGroup[1]}`;
      })
      //.sortBy(function(incidents) {
      //  return incidents.length;
      //})
      //.takeRight(5)
      //.reverse()
      //.map(function(incidentGroup) {
      //  return `${incidentGroup[0]['INCIDENT_ADDRESS']} - ${incidentGroup.length}`;
      //})
      .value();
};

let corners = computeData(parsedData(trafficData), 'INCIDENT_ADDRESS');
let neighborhoods = computeData(parsedData(trafficData), 'NEIGHBORHOOD_ID');
let crimes = computeData(parsedData(crimeData), 'NEIGHBORHOOD_ID');

console.timeEnd('parse csv');
console.time('parse accidents');

console.log(corners);

//let mappedAccidents = accidentsByNeighborhood

console.timeEnd('parse accidents');
console.timeEnd('entire process');

