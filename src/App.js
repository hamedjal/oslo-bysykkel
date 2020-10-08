import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [stationInformation, setStationInformation] = useState(null);
  const [error, setError] = useState(false);
  const [temp, setTemp] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setTemp((prevTemp) => prevTemp + 1);
    }, 2000);
  }, []);

  useEffect(() => {
    fetchData();
  }, [temp]);

  const fetchData = async () => {
    Promise.all([
      fetch('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json'),
      fetch('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json')])
      .then( responses => {
        return Promise.all(responses.map(response => {
        return response.json();
      }))})
      .then(response => {
       setStationInformation(response);
      })
      .catch(error => {
       setError(true);
      });
  };
 
  const style = {
    color: 'red',
  };
  let stationsInfo;
  !error ? stationsInfo = <p>Loading...</p> : stationsInfo = <p>Unable to fetch data from API...</p>;
        if (stationInformation) {          
    stationsInfo = (
      <table>
        <thead>
          <tr>
            <th>Station Names</th>
            <th>Available Bikes</th>
            <th>Available Docks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{stationInformation[0].data.stations.map(station => <div key={station.station_id}>{station.name}</div>)}</td>
            <td>{stationInformation[1].data.stations.map(station => <div key={station.station_id}> {station.num_bikes_available === 0 ? <strong style={style}>{station.num_bikes_available}</strong>:station.num_bikes_available}</div>)}</td>
            <td>{stationInformation[1].data.stations.map(station => <div key={station.station_id}>{station.num_docks_available === 0 ? <strong style={style}>{station.num_docks_available}</strong>:station.num_docks_available}</div>)}</td>
          </tr>
        </tbody>
      </table>
    );
  }
  return <div className="App">{stationsInfo}</div>;
};

export default App;
