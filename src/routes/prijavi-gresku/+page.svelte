<script>
  let doctorName = $state('');
  let issueType = $state('');
  let description = $state('');
  let reporterEmail = $state('');
  let success = $state(false);
  let error = $state('');

  async function handleSubmit(/** @type {Event} */ event) {
    event.preventDefault();
    success = false;
    error = '';

    try {
      const response = await fetch('/api/report-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorName, issueType, description, reporterEmail })
      });

      if (response.ok) {
        success = true;
        doctorName = '';
        issueType = '';
        description = '';
        reporterEmail = '';
      } else {
        const data = await response.json();
        error = data.message || 'Failed to submit the report.';
      }
    } catch (err) {
      error = 'An unexpected error occurred.';
    }
  }
</script>

<svelte:head>
  <title>Prijava netočnih informacija o dijabetologu</title>
</svelte:head>

<div class="container mx-auto max-w-2xl p-6">
  <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">
    Prijavite netočne informacije o dijabetologu
  </h1>

  {#if success}
    <p class="text-center text-green-600 bg-green-100 border border-green-200 p-4 rounded-lg">
      Hvala Vam što ste prijavili problem. Vaš unos je zabilježen i biće pregledan.
    </p>
  {/if}

  {#if error}
    <p class="text-center text-red-600 bg-red-100 border border-red-200 p-4 rounded-lg">
      {error}
    </p>
  {/if}

  <form onsubmit={handleSubmit} class="bg-white shadow-lg rounded-lg p-6 space-y-6">
    <div>
      <label for="doctorName" class="block text-sm font-medium text-gray-700">
        Ime i prezime dijabetologa
      </label>
      <input
        id="doctorName"
        type="text"
        bind:value={doctorName}
        required
        class="input input-bordered w-full mt-1 px-3 py-2 rounded-lg shadow-sm border border-gray-300 focus:ring focus:ring-blue-300"
        placeholder="Unesite ime i prezime dijabetologa"
      />
    </div>

    <div>
      <label for="issueType" class="block text-sm font-medium text-gray-700">
        Tip problema
      </label>
      <select
        id="issueType"
        bind:value={issueType}
        required
        class="input input-bordered w-full mt-1 px-3 py-2 rounded-lg shadow-sm border border-gray-300 focus:ring focus:ring-blue-300"
      >
        <option value="" disabled selected>Odaberite tip problema</option>
        <option value="Promena institucije">Promjena institucije</option>
        <option value="Netačni kontakt podaci">Netočni kontakt podaci</option>
        <option value="Pogrešan opis">Pogrešan opis</option>
        <option value="Drugo">Drugo</option>
      </select>
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">
        Opis problema
      </label>
      <textarea
        id="description"
        bind:value={description}
        required
        class="textarea textarea-bordered w-full mt-1 px-3 py-2 rounded-lg shadow-sm border border-gray-300 focus:ring focus:ring-blue-300"
        rows="5"
        placeholder="Opišite problem detaljno"
      ></textarea>
    </div>

    <div>
      <label for="reporterEmail" class="block text-sm font-medium text-gray-700">
        Vaša email adresa (opcionalno)
      </label>
      <input
        id="reporterEmail"
        type="email"
        bind:value={reporterEmail}
        class="input input-bordered w-full mt-1 px-3 py-2 rounded-lg shadow-sm border border-gray-300 focus:ring focus:ring-blue-300"
        placeholder="Unesite vašu email adresu (ako želite)"
      />
    </div>

    <button
      type="submit"
      class="btn btn-primary w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg shadow-md transition duration-300"
    >
      Pošaljite prijavu
    </button>
  </form>
</div>
