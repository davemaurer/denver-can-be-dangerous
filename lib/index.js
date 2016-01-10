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

console.timeEnd('parse csv');
console.time('parse accidents');

let accidentsByNeighborhood = function(func, data) {
   _.chain(data)
    .filter(function(record) {
      return record.OFFENSE_CATEGORY_ID === 'traffic-accident' && record.INCIDENT_ADDRESS !== '';
    })
    .groupBy('INCIDENT_ADDRESS')
    //.map(function (incidents, incidentAddress) {
    //  return [incidentAddress, incidents.length];
    //})
    //.sort(function (a, b) {
    //  return b[1] - a[1];
    //})
    //.take(5)
    //.map(function(incidentGroup) {
    // return `${incidentGroup[0]} - ${incidentGroup[1]}`;
    //})
    .sortBy(function (incidents, incidentAddress) {
      return incidents.length;
    })
    .takeRight(5)
    .reverse()
    .map(function(incidentGroup) {
      return `${incidentGroup[0]['INCIDENT_ADDRESS']} - ${incidentGroup.length}`;
    })
    .value();
};

console.log(accidentsByNeighborhood(parsedData, trafficData));

//let mappedAccidents = accidentsByNeighborhood

console.timeEnd('parse accidents');
console.timeEnd('entire process');

