<script>
    /** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
    let { doctor, reviews } = data;

    // Helper function to generate an array of stars
    function renderStars(/** @type {number} */rating) {
        return Array.from({ length: 5 }, (_, i) => i < rating ? 'filled' : 'empty');
    }

    let newReview = $state({
        ratingSkill: 0,
        ratingKindness: 0,
        ratingEthicality: 0,
        ratingInstitution: 0,
        comment: '',
        created_by: ''
    });
    let successMessage = $state('');
    let errorMessage = $state('');
    
    /**
	 * @param {{ preventDefault: () => void; }} ev
	 */
    async function submitReview(ev) {
        ev.preventDefault();
        successMessage = '';
        errorMessage = '';

        try {
            const response = await fetch(`/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctor_id: doctor.id,
                    ...newReview
                })
            });

            if (!response.ok) throw new Error('');

            const addedReview = await response.json();
            //reviews.unshift(addedReview); // Update the reviews list dynamically
            successMessage = 'Hvala vam! Vaša recenzija je uspješno dodana. Da bi bila vidljiva, morate potvrditi Vaš email.';
            newReview = { ratingSkill: 0, ratingKindness: 0, ratingEthicality: 0, ratingInstitution: 0, comment: '', created_by: '' };
        } catch (error) {
            // @ts-ignore
            errorMessage = error.message || 'Došlo je do greške prilikom dodavanja recenzije.';
        }
    }

    // Average ratings for each category
    const categories = [
        { label: 'Stručnost', rating: doctor.ratingSkill },
        { label: 'Ljubaznost', rating: doctor.ratingKindness },
        { label: 'Etičnost', rating: doctor.ratingEthicality },
        { label: 'Ustanova', rating: doctor.institution.rating },
    ];
</script>

<svelte:head>
    <title>{doctor.first_name} {doctor.last_name} - Najbolji dijabetolozi u Vašem gradu</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
    <!-- Doctor Profile -->
    <div class="flex flex-col md:flex-row items-center md:items-start md:space-x-8 mb-12">
        <div class="w-40 h-40 md:w-60 md:h-60 bg-blue-100 rounded-full flex-shrink-0 overflow-hidden">
            <img
                src={`https://placehold.co/150x150@2x.png?text=${doctor.first_name}`}
                alt="{doctor.first_name} {doctor.last_name}"
                class="w-full h-full object-cover"
            />
        </div>

        <div class="flex-1 space-y-6">
            <div>
                <h1 class="text-4xl font-bold text-gray-800">{doctor.first_name} {doctor.last_name}</h1>
                <h2 class="text-2xl text-gray-600">{doctor.institution.name}</h2>
                <p class="text-gray-600">{doctor.bio}</p>
            </div>

            <!-- Overall Rating -->
            <div>
                <p class="text-yellow-500 font-bold text-xl mb-2">⭐ {doctor.rating.toFixed(1)} - Ukupna ocjena</p>

                <!-- Ratings by Category -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {#each categories as category}
                        <div class="text-center">
                            <p class="text-sm text-gray-600">{category.label}</p>
                            <div class="flex justify-center space-x-1 mt-1" aria-label={`Rating: ${category.rating} out of 5`}>
                                {#each renderStars(category.rating) as star}
                                <svg
                                    class="w-6 h-6 {star === 'filled' ? 'text-yellow-500' : 'text-gray-300'}"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="{star === 'filled' ? 'currentColor' : 'none'}"
                                    stroke="{star === 'filled' ? 'none' : 'currentColor'}"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    stroke-width="1.5"
                                >
                                    <path
                                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                    />
                                </svg>
                                {/each}
                            </div>
                            <p class="text-sm text-gray-600">{category.rating.toFixed(1)}</p>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>

    <!-- Add Review Form -->
    <div class="mt-12 p-6 border rounded-lg bg-white shadow">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Dodajte recenziju</h2>

        {#if successMessage}
            <div class="p-4 mb-6 bg-green-100 text-green-700 rounded">{successMessage}</div>
        {/if}
        {#if errorMessage}
            <div class="p-4 mb-6 bg-red-100 text-red-700 rounded">{errorMessage}</div>
        {/if}

        <form onsubmit={submitReview} class="space-y-4">
            <!-- Created By -->
            <div>
                <label for="created_by" class="block text-sm font-medium text-gray-700">Vaše ime</label>
                <input
                    id="created_by"
                    type="text"
                    bind:value={newReview.created_by}
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <!-- Ratings -->
            {#each [
                { label: 'Stručnost', key: 'ratingSkill' },
                { label: 'Ljubaznost', key: 'ratingKindness' },
                { label: 'Etičnost', key: 'ratingEthicality' },
                { label: 'Ustanova', key: 'ratingInstitution' }
            ] as category}
                <div>
                    <label class="block text-sm font-medium text-gray-700">{category.label}</label>
                    <div class="flex items-center mt-2 space-x-1">
                        {#each Array(5) as _, i}
                            <svg role="button" tabindex="0"
                                onclick={() => (newReview[category.key] = i + 1)}
                                class="w-6 h-6 cursor-pointer {i < newReview[category.key] ? 'text-yellow-500' : 'text-gray-300'}"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="{i < newReview[category.key] ? 'currentColor' : 'none'}"
                                viewBox="0 0 24 24"
                                stroke="{i < newReview[category.key] ? 'none' : 'currentColor'}"
                                stroke-width="1.5"
                            >
                                <path
                                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        {/each}
                    </div>
                </div>
            {/each}

            <!-- Comment -->
            <div>
                <label for="comment" class="block text-sm font-medium text-gray-700">Komentar</label>
                <textarea
                    id="comment"
                    rows="4"
                    bind:value={newReview.comment}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
            </div>

            <!-- Submit Button -->
            <div>
                <button
                    type="submit"
                    class="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Pošaljite recenziju
                </button>
            </div>
        </form>
    </div>

    <!-- Reviews Section -->
    <div>
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Recenzije</h2>

        {#if reviews.length}
            <div class="space-y-6">
                {#each reviews as review}
                    <div class="p-6 border rounded-lg bg-white shadow hover:shadow-lg transition">
                        <h3 class="text-lg font-bold text-gray-800">{review.created_by}</h3>

                        {#each [
                            { label: 'Stručnost', rating: review.ratingSkill },
                            { label: 'Ljubaznost', rating: review.ratingKindness },
                            { label: 'Etičnost', rating: review.ratingEthicality },
                            { label: 'Ustanova', rating: review.ratingInstitution }
                        ] as category}
                            <div class="flex space-x-4 text-gray-600">
                                <p>{category.label}:</p>
                                <div class="flex" aria-label={`Rating: ${category.rating} out of 5`}>
                                    {#each renderStars(category.rating) as star}
                                        <svg
                                            class="w-5 h-5 {star === 'filled' ? 'text-yellow-500' : 'text-gray-300'}"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="{star === 'filled' ? 'currentColor' : 'none'}"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                            />
                                        </svg>
                                    {/each}
                                </div>
                            </div>
                        {/each}

                        <p class="text-gray-600 mt-2">{review.comment}</p>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="text-gray-500">Ovaj dijabetolog još nema recenzija.</p>
        {/if}
    </div>
</div>
