import { useState, useEffect } from 'react';

export default (url, parameters) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);

  setIsLoading(true);
  console.log('Sending request to URL: ' + url);
  fetch(url, parameters)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch.');
      }
      return response.json();
    })
    .then(data => {
      setIsLoading(false);
      setFetchedData(data);
    })
    .catch(err => {
      console.log(err);
      setIsLoading(false);
    });
  return [isLoading, fetchedData];
};