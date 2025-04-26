fetch('/api')
  .then(response => response.json())
  .then(data => {
    document.getElementById('api-response').innerText = data.message;
  })
  .catch(error => {
    document.getElementById('api-response').innerText = 'Error fetching API.';
  });

