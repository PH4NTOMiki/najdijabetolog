<script>
	import { invalidateAll } from '$app/navigation';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();

    let doctors = $state([...data.doctors]);
    let loadingDoctors = $state(new Set());
    let successMessage = $state('');
    let errorMessage = $state('');
    let showModal = $state(false);
    let newDoctor = $state({
        first_name: '',
        last_name: '',
        ratingskill: '',
        ratingkindness: '',
        ratingethicality: ''
    });
    let creatingDoctor = $state(false);

    async function deleteDoctor(id) {
        if (!confirm('Jeste li sigurni da želite izbrisati ovog dijabetologa? Ova radnja je nepovratna.')) return;

        loadingDoctors.add(id);
        try {
            const response = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
            const result = await response.json();

            if (!response.ok) throw new Error(result.error || 'Nepoznata greška');

            successMessage = `Dijabetolog uspješno izbrisan.`;
            errorMessage = '';
            doctors = doctors.filter(doctor => doctor.id !== id);
        } catch (err) {
            errorMessage = `Greška prilikom brisanja dijabetologa: ${err.message}`;
            successMessage = '';
        } finally {
            loadingDoctors.delete(id);
        }
    }

    async function createDoctor() {
        creatingDoctor = true;
        try {
            const response = await fetch('/api/doctors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDoctor)
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Greška prilikom dodavanja dijabetologa');
            }

            successMessage = 'Dijabetolog uspješno dodan!';
            errorMessage = '';
            showModal = false;
            newDoctor = { first_name: '', last_name: '', ratingskill: '', ratingkindness: '', ratingethicality: '' };

            // Refresh the doctor list
            invalidateAll();
        } catch (err) {
            errorMessage = `Greška prilikom dodavanja dijabetologa: ${err.message}`;
            successMessage = '';
        } finally {
            creatingDoctor = false;
        }
    }
</script>

<svelte:head>
    <title>Upravljanje dijabetolozima</title>
</svelte:head>

<main class="p-8 space-y-8">
    <section class="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h1 class="text-2xl font-bold text-gray-700 mb-4">Upravljanje dijabetolozima</h1>
        <button
            class="mb-4 px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-transform duration-150"
            on:click={() => showModal = true}
        >
            + Dodaj dijabetologa
        </button>
        {#if successMessage}
            <div class="p-2 mb-4 text-sm text-green-800 bg-green-200 border border-green-300 rounded">
                {successMessage}
            </div>
        {/if}
        {#if errorMessage}
            <div class="p-2 mb-4 text-sm text-red-800 bg-red-200 border border-red-300 rounded">
                {errorMessage}
            </div>
        {/if}
        {#if doctors.length === 0}
            <p class="text-gray-600">-</p>
        {:else}
            <ul class="space-y-4">
                {#each doctors as doctor}
                    <li class="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50 flex justify-between items-center">
                        <div>
                            <h2 class="text-lg font-medium text-gray-700">{doctor.first_name} {doctor.last_name}</h2>
                            <p class="text-sm text-gray-600">Stručnost Rating: {doctor.ratingskill}</p>
                            <p class="text-sm text-gray-600">Ljubaznost Rating: {doctor.ratingkindness}</p>
                            <p class="text-sm text-gray-600">Etičnost Rating: {doctor.ratingethicality}</p>
                        </div>
                        <div class="space-x-4">
                            <a href="/admin/dijabetolozi/{doctor.id}"><button
                                class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-transform duration-150">
                                Uredi
                            </button></a>
                            <button
                                class="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition-transform duration-150 flex items-center justify-center"
                                on:click={() => deleteDoctor(doctor.id)}
                                disabled={loadingDoctors.has(doctor.id)}
                            >
                                {#if loadingDoctors.has(doctor.id)}
                                    <svg class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C3.164 0 0 3.164 0 12h4z"></path>
                                    </svg>
                                    Brisanje...
                                {:else}
                                    Izbriši
                                {/if}
                            </button>
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}
    </section>

    {#if showModal}
        <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div class="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 class="text-lg font-bold mb-4">Dodaj novog dijabetologa</h2>
                <form on:submit|preventDefault={createDoctor}>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Ime</label>
                        <input type="text" bind:value={newDoctor.first_name} class="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Prezime</label>
                        <input type="text" bind:value={newDoctor.last_name} class="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Stručnost Rating</label>
                        <input type="number" bind:value={newDoctor.ratingskill} min="0" max="5" step="0.1" class="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Ljubaznost Rating</label>
                        <input type="number" bind:value={newDoctor.ratingkindness} min="0" max="5" step="0.1" class="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Etičnost Rating</label>
                        <input type="number" bind:value={newDoctor.ratingethicality} min="0" max="5" step="0.1" class="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200" required>
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button type="button" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600" on:click={() => showModal = false}>Otkaži</button>
                        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center" disabled={creatingDoctor}>
                            {#if creatingDoctor}
                                <svg class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C3.164 0 0 3.164 0 12h4z"></path>
                                </svg>
                                Dodavanje...
                            {:else}
                                Dodaj dijabetologa
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</main>