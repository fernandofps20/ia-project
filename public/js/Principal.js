document.addEventListener('DOMContentLoaded', () => {
    const queryInput = document.getElementById('queryInput');
    const submitBtn = document.getElementById('submitBtn');
    const resultDiv = document.getElementById('result');

    submitBtn.addEventListener('click', async () => {
        const queryText = queryInput.value.trim();
        
        if (!queryText) {
            alert('Please enter a query description');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Generating...';
            resultDiv.innerHTML = '<p>Processing request...</p>';

            console.log('Sending request with prompt:', queryText);

            const response = await fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: queryText })
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            
            if (response.ok) {
                if (!data.queries || data.queries.length === 0) {
                    resultDiv.innerHTML = '<p class="error">No queries generated</p>';
                    return;
                }

                let html = '<div class="results">';
                data.queries.forEach((query, index) => {
                    html += `
                        <div class="query-result">
                            <h3>Query ${index + 1}:</h3>
                            <pre class="query">${query}</pre>
                            ${data.results[index].error 
                                ? `<p class="error">Error: ${data.results[index].error}</p>`
                                : `<pre class="result">${JSON.stringify(data.results[index].result, null, 2)}</pre>`
                            }
                        </div>`;
                });
                html += '</div>';
                resultDiv.innerHTML = html;
            } else {
                resultDiv.innerHTML = `
                    <div class="error-container">
                        <p class="error">Error: ${data.error}</p>
                        <p class="error-details">${data.details || 'No additional details'}</p>
                    </div>`;
            }
        } catch (error) {
            console.error('Frontend error:', error);
            resultDiv.innerHTML = `
                <div class="error-container">
                    <p class="error">Error: Failed to process request</p>
                    <p class="error-details">${error.message}</p>
                </div>`;
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Generate Query';
        }
    });
});
