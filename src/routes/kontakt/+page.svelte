<script>
  let name = $state('');
  let email = $state('');
  let message = $state('');
  let success = $state(false);
  let error = $state('');

  async function handleSubmit(/** @type {Event} */ event) {
    event.preventDefault();
    success = false;
    error = '';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      if (response.ok) {
        success = true;
        name = '';
        email = '';
        message = '';
      } else {
        const data = await response.json();
        error = data.message || 'Failed to send the message.';
      }
    } catch (err) {
      error = 'An unexpected error occurred.';
    }
  }
</script>
<svelte:head><title>Kontakt - Najbolji dijabetolozi u Vašem gradu</title></svelte:head>

<div class="container mx-auto max-w-2xl p-6">
  <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Kontaktirajte nas</h1>

  {#if success}
    <p class="text-center text-green-600 bg-green-100 border border-green-200 p-4 rounded-lg">
      Hvala Vam što ste nam poslali upit. Uskoro ćete dobiti odgovor.
    </p>
  {/if}

  {#if error}
    <p class="text-center text-red-600 bg-red-100 border border-red-200 p-4 rounded-lg">
      {error}
    </p>
  {/if}

  <form onsubmit={handleSubmit} class="bg-white shadow-lg rounded-lg p-6 space-y-6">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">Ime</label>
      <input
        id="name"
        type="text"
        bind:value={name}
        required
        class="input input-bordered w-full mt-1 px-3 py-2 rounded-lg shadow-sm border border-gray-300 focus:ring focus:ring-blue-300"
        placeholder="Unesite vaše ime"
      />
    </div>
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        required
        class="input input-bordered w-full mt-1 px-3 py-2 rounded-lg shadow-sm border border-gray-300 focus:ring focus:ring-blue-300"
        placeholder="Unesite vašu email adresu"
      />
    </div>
    <div>
      <label for="message" class="block text-sm font-medium text-gray-700">Poruka</label>
      <textarea
        id="message"
        bind:value={message}
        required
        class="textarea textarea-bordered w-full mt-1 px-3 py-2 rounded-lg shadow-sm border border-gray-300 focus:ring focus:ring-blue-300"
        rows="5"
        placeholder="Napišite vašu poruku"
      ></textarea>
    </div>
    <button
      type="submit"
      class="btn btn-primary w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg shadow-md transition duration-300"
    >
      Pošaljite
    </button>
  </form>
</div>
