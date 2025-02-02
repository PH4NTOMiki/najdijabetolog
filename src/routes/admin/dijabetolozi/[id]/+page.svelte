<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();

    let updatedDoctor = $state({ ...data.doctor });
    let updatedReviews = $state([...data.reviews]);
    let successMessage = $state('');
    let errorMessage = $state('');
    let imageFile = $state(null);
    let imagePreview = $state(null);
    let uploadingImage = $state(false);

    function handleImageChange(event) {
        const file = event.target.files[0];
        if (file) {
            imageFile = file;
            // Create preview URL
            // @ts-ignore
            imagePreview = URL.createObjectURL(file);
        }
    }

    async function uploadProfileImage() {
        if (!imageFile) return;

        uploadingImage = true;
        const formData = new FormData();
        formData.append('image', imageFile);
        // @ts-ignore
        formData.append('doctorId', data.doctor.id);

        try {
            const response = await fetch('/api/change-doctor-profile', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            if (!response.ok) throw new Error(result.error || 'Unknown error');

            successMessage = 'Profile image successfully updated';
            errorMessage = '';
            // Update the doctor's image URL if returned in the response
            if (result.imageUrl) {
                updatedDoctor.profile_image = result.imageUrl;
            }
        } catch (err) {
            errorMessage = `Failed to update profile image: ${err.message}`;
            successMessage = '';
        } finally {
            uploadingImage = false;
        }
    }

    // @ts-ignore
    async function updateDoctor(ev) {ev.preventDefault();
    try {
        const response = await fetch(`/api/doctors/${data.doctor.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedDoctor),
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.error || 'Unknown error');

        successMessage = result.message;
        errorMessage = '';
    } catch (err) {
        errorMessage = `Failed to update doctor details: ${err.message}`;
        successMessage = '';
    }
}

async function updateReview(reviewId, updatedData) {
    try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.error || 'Nepoznata greška');

        successMessage = result.message;
        errorMessage = '';
    } catch (err) {
        errorMessage = `Greška prilikom ažuriranja recenzije: ${err.message}`;
        successMessage = '';
    }
}

let loadingDoctor = $state(false);
let loadingReviews = $state({});

async function deleteDoctor() {
    if (!confirm('Jeste li sigurni da želite izbrisati ovog dijabetologa? Ova radnja ne može biti poništena.')) return;

    loadingDoctor = true;
    try {
        const response = await fetch(`/api/doctors/${data.doctor.id}`, {
            method: 'DELETE',
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.error || 'Nepoznata greška');

        successMessage = 'Dijabetolog uspješno izbrisan.';
        errorMessage = '';
        // Optionally, navigate away or reset state
    } catch (err) {
        errorMessage = `Greška pri brisanju dijabetologa: ${err.message}`;
        successMessage = '';
    } finally {
        loadingDoctor = false;
    }
}

async function deleteReview(reviewId) {
    if (!confirm('Jeste li sigurni da želite izbrisati ovu recenziju? Ova radnja ne može biti poništena.')) return;

    loadingReviews = { ...loadingReviews, [reviewId]: true };
    try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE',
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.error || 'Nepoznata greška');

        successMessage = `Recenzija uspješno izbrisana.`;
        errorMessage = '';
        updatedReviews = updatedReviews.filter((review) => review.id !== reviewId);
    } catch (err) {
        errorMessage = `Greška pri brisanju recenzije: ${err.message}`;
        successMessage = '';
    } finally {
        loadingReviews = { ...loadingReviews, [reviewId]: false };
    }
}


</script>
<svelte:head>
    <title>Uredi dijabetologa - {updatedDoctor.first_name} {updatedDoctor.last_name}</title>
</svelte:head>

<main class="p-8 space-y-8">
    <!-- Doctor Section -->
    <section class="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h1 class="text-2xl font-bold text-gray-700 mb-4">Uredi dijabetologa</h1>
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

            <!-- Profile Image Section -->
        <div class="mb-6 p-4 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-medium text-gray-700 mb-4">Profilna slika</h3>
            <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                    {#if imagePreview}
                        <img
                            src={imagePreview}
                            alt="Profile preview"
                            class="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                    {:else if updatedDoctor.profile_image}
                        <img
                            src={updatedDoctor.profile_image}
                            alt="Current profile"
                            class="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                    {:else}
                        <div class="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span class="text-gray-500">Nema slike</span>
                        </div>
                    {/if}
                </div>
                <div class="flex-grow space-y-4">
                    <input
                        type="file"
                        accept="image/*"
                        onchange={handleImageChange}
                        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    <button
                        type="button"
                        class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transform transition-transform duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        onclick={uploadProfileImage}
                        disabled={!imageFile || uploadingImage}
                    >
                        {#if uploadingImage}
                            <svg class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C3.164 0 0 3.164 0 12h4z"></path>
                            </svg>
                            Uploading...
                        {:else}
                            Promijenite sliku
                        {/if}
                    </button>
                </div>
            </div>
        </div>

        <form onsubmit={updateDoctor} class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label class="block">
                    <span class="text-gray-600">Ime:</span>
                    <input
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        bind:value={updatedDoctor.first_name}
                        required
                    />
                </label>
                <label class="block">
                    <span class="text-gray-600">Prezime:</span>
                    <input
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        bind:value={updatedDoctor.last_name}
                        required
                    />
                </label>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label class="block">
                    <span class="text-gray-600">Stručnost Ocjena:</span>
                    <input
                        type="number"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        bind:value={updatedDoctor.ratingskill}
                        min="1"
                        max="5"
                        required
                    />
                </label>
                <label class="block">
                    <span class="text-gray-600">Ljubaznost Ocjena:</span>
                    <input
                        type="number"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        bind:value={updatedDoctor.ratingkindness}
                        min="1"
                        max="5"
                        required
                    />
                </label>
                <label class="block">
                    <span class="text-gray-600">Etičnost Ocjena:</span>
                    <input
                        type="number"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        bind:value={updatedDoctor.ratingethicality}
                        min="1"
                        max="5"
                        required
                    />
                </label>
            </div>
            <button
                type="submit"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transform transition-transform duration-150 active:scale-95"
            >
                Spremi
            </button>
        </form>
        <br>
        <button
            type="button"
            class="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transform transition-transform duration-150 active:scale-95 flex items-center justify-center"
            onclick={deleteDoctor}
            disabled={loadingDoctor}
        >
            {#if loadingDoctor}
                <svg class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C3.164 0 0 3.164 0 12h4z"></path>
                </svg>
                Obriši...
            {:else}
                Obriši doktora
            {/if}
        </button>
    </section>

    <!-- Reviews Section -->
    <section class="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-700 mb-4">Uredi ocjene</h2>
        <div class="space-y-6">
            {#each updatedReviews as review, index}
                <div class="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
                    <h3 class="text-lg font-medium text-gray-700">
                        Ocjena #{index + 1}
                    </h3>
                    <form
                        onsubmit={(ev) =>{ev.preventDefault();
                            updateReview(review.id, {
                                comment: review.comment,
                                ratinginstitution: review.ratinginstitution,
                                ratingskill: review.ratingskill,
                                ratingkindness: review.ratingkindness,
                                ratingethicality: review.ratingethicality,
                                created_by: review.created_by,
                                email: review.email,
                            })
                        }}
                        class="space-y-4 mt-4"
                    >
                        <label class="block">
                            <span class="text-gray-600">Komentar:</span>
                            <textarea
                                rows="3"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                bind:value={review.comment}
                                required
                            ></textarea>
                        </label>
                        <label class="block">
                            <span class="text-gray-600">Institucija Ocjena:</span>
                            <input
                                type="number"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                bind:value={review.ratinginstitution}
                                min="1"
                                max="5"
                                required
                            />
                        </label>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <label class="block">
                                <span class="text-gray-600">Stručnost Ocjena:</span>
                                <input
                                    type="number"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    bind:value={review.ratingskill}
                                    min="1"
                                    max="5"
                                    required
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-600">Ljubaznost Ocjena:</span>
                                <input
                                    type="number"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    bind:value={review.ratingkindness}
                                    min="1"
                                    max="5"
                                    required
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-600">Etičnost Ocjena:</span>
                                <input
                                    type="number"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    bind:value={review.ratingethicality}
                                    min="1"
                                    max="5"
                                    required
                                />
                            </label>
                        </div>
                        <label class="block">
                            <span class="text-gray-600">Ocjenu ostavio:</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                bind:value={review.created_by}
                                required
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-600">Email:</span>
                            <input
                                type="email"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                bind:value={review.email}
                                required
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-600">Ostavljena:</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm"
                                value={new Date(review.created_at).toLocaleString()}
                                readonly
                            />
                        </label>
                        <button
                            type="submit"
                            class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transform transition-transform duration-150 active:scale-95"
                        >
                            Spremi
                        </button>
                    </form>
                    <br>
                    <button
                        type="button"
                        class="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transform transition-transform duration-150 active:scale-95 flex items-center justify-center"
                        onclick={() => deleteReview(review.id)}
                        disabled={loadingReviews[review.id]}
                    >
                        {#if loadingReviews[review.id]}
                            <svg class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C3.164 0 0 3.164 0 12h4z"></path>
                            </svg>
                            Obriši...
                        {:else}
                            Obriši ocjenu
                        {/if}
                    </button>
                </div>
            {/each}
        </div>
    </section>
</main>
