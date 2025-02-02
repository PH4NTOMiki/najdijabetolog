<script>
    let file;
    let message = '';
  
    async function handleSubmit(event) {
      // Prevent default form submission behavior
      event.preventDefault();
  
      if (!file) {
        message = 'Please select a file to upload.';
        return;
      }

      // Optional client-side check for image type
      if (!file.type.startsWith('image/')) {
        message = 'Only image files are allowed.';
        return;
      }
  
      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append('file', file);
  
      // POST the form data to our API route
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
  
      const data = await res.json();
      message = data.message;
    }
  </script>
  
  <h1>Upload a File</h1>
  <form onsubmit={handleSubmit}>
    <input
      type="file"
      accept="image/*"
      onchange={(e) => {
        file = e.target?.files[0];
      }}
    />
    <button type="submit">Upload File</button>
  </form>
  
  {#if message}
    <p>{message}</p>
  {/if}
  