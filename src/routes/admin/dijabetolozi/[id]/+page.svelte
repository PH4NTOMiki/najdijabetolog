<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();

    let updatedDoctor = $state({ ...data.doctor });
    let updatedReviews = $state([...data.reviews]);
    let successMessage = $state('');
    let errorMessage = $state('');

    async function updateDoctor() {
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

        if (!response.ok) throw new Error(result.error || 'Unknown error');

        successMessage = result.message;
        errorMessage = '';
    } catch (err) {
        errorMessage = `Failed to update review: ${err.message}`;
        successMessage = '';
    }
}

</script>

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
        <form on:submit|preventDefault={updateDoctor} class="space-y-4">
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
                        on:submit|preventDefault={() =>
                            updateReview(review.id, {
                                comment: review.comment,
                                ratinginstitution: review.ratinginstitution,
                                ratingskill: review.ratingskill,
                                ratingkindness: review.ratingkindness,
                                ratingethicality: review.ratingethicality,
                                created_by: review.created_by,
                                email: review.email,
                            })
                        }
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
                </div>
            {/each}
        </div>
    </section>
</main>
